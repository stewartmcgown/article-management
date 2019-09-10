import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as otplib from 'otplib';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { PinResponse } from '../api/controllers/responses/PinResponse';
import { TokenResponse } from '../api/controllers/responses/TokenResponse';
import { UserNotFoundError } from '../api/errors/UserNotFoundError';
import { Editor } from '../api/models/Editor';
import { Levels } from '../api/models/enums';
import { User } from '../api/models/User';
import { EditorRepository } from '../api/repositories/EditorRepository';
import { events } from '../api/subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';
import { InvalidPinError } from './errors/InvalidPinError';

@Service()
export class AuthService {

    private static EXPIRES_IN = '24h';
    private static AUTHORIZATION_HEADER_KEY = 'authorization';
    private static COOKIE_TOKEN_KEY = 'ams-token';

    /**
     * How long between PIN requests?
     */
    private static PIN_REQUEST_TIMEOUT = 6000;

    private serviceUser: User;

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private editorRepository: EditorRepository,
        // @OrmRepository() private authorRepository: AuthorRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ) {
        otplib.authenticator.options = {
            step: 60,
            window: 1,
        };
    }

    /**
     * Return a default service user with admin permissions.
     *
     * The user is persisted in the database, and is guaranteed to be able to execute
     * all actions.
     */
    public async getServiceUser(): Promise<User> {
        if (this.serviceUser) { return this.serviceUser; }

        this.serviceUser = new Editor();
        Object.assign(this.serviceUser, {
            name: 'Service Account',
            email: 'service-account@ysj-internal',
            level: Levels.ADMIN,
        });

        await this.editorRepository.save(this.serviceUser);

        return this.serviceUser;
    }

    public parseTokenFromRequest(request: Request): string {

        const parseAuthHeader = () => {
            const authHeader: string = request.headers[AuthService.AUTHORIZATION_HEADER_KEY] as string;

            if (!authHeader.startsWith('Bearer ')) {
                return undefined;
            }

            return authHeader.substr(7);
        }

        const parseCookie = () => request.cookies[AuthService.COOKIE_TOKEN_KEY] as string;

        const options = [parseAuthHeader, parseCookie];

        for (const option of options) {
            const token = option();
            if (token) {
                return token;
            }
        }

        return '';
    }

    /**
     * Issues a PIN
     *
     * @param email email to issue for
     */
    public async issuePin(email: string): Promise<PinResponse> {
        const user = await this.editorRepository.findOne({
            where: {
                email,
            },
            select: ['id', 'secret', 'email', 'name', 'lastPinIssued'],
        });

        if (!user) {
            throw new UserNotFoundError();
        }

        if (!user.secret) {
            user.secret = otplib.authenticator.generateSecret();
        }

        if (user.lastPinIssued instanceof Date && this.tooSoonToIssuePin(user.lastPinIssued)) {
            throw new Error(`You're doing that too much.`);
        }

        const pin = otplib.authenticator.generate(user.secret);

        if (!pin) {
            throw new Error();
        }

        user.lastPinIssued = new Date();

        this.editorRepository.save(user);

        this.log.info('Dispatching new pin...');

        this.eventDispatcher.dispatch(events.pin.issued, {
            pin,
            user,
        });

        return {
            success: true,
        };

    }

    public async verifyToken(token: string): Promise<User> {
        const { id } = jwt.verify(token, this.secret()) as any;

        const user = await this.editorRepository.findOne(id);

        return user;

    }

    public async issueToken(pin: string, email: string): Promise<TokenResponse> {
        const user = await this.editorRepository.findOne({
            where: {
                email,
            },
            select: ['id', 'email', 'secret'],
        });

        const pinValid = otplib.authenticator.verify({
            token: pin,
            secret: user.secret,
        });

        if (pinValid !== true) {
            throw new InvalidPinError();
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
        }, this.secret(), {
            expiresIn: AuthService.EXPIRES_IN,
        });

        return {
            token,
        };
    }

    /**
     * @param lastIssue the last issue date
     * @return if it is too soon to issue a pin or not
     */
    private tooSoonToIssuePin(lastIssue: Date): boolean {
        return (new Date().getTime() - lastIssue.getTime()) < AuthService.PIN_REQUEST_TIMEOUT;
    }

    private secret(): string {
        return env.app.secret;
    }
}
