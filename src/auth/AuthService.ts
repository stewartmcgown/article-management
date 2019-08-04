import * as jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { PinResponse } from '../api/controllers/responses/PinResponse';
import { TokenResponse } from '../api/controllers/responses/TokenResponse';
import { UserNotFoundError } from '../api/errors/UserNotFoundError';
import { User } from '../api/models/User';
import { EditorRepository } from '../api/repositories/EditorRepository';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';
import { InvalidPinError } from './errors/InvalidPinError';

@Service()
export class AuthService {

    private static EXPIRES_IN = '1h';
    private static AUTHORIZATION_HEADER_KEY = 'Authorization';

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private editorRepository: EditorRepository,
        // @OrmRepository() private authorRepository: AuthorRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ) { }

    public parseTokenFromRequest(request: any): string {
        const authHeader: string = request.headers[AuthService.AUTHORIZATION_HEADER_KEY];

        if (!authHeader.startsWith('Bearer ')) {
            return undefined;
        }

        return authHeader.substr(7);
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
           select: ['id', 'secret'],
       });

       this.log.debug(user.toString());

       if (!user) {
           throw new UserNotFoundError();
        }

        if (!user.secret) {
            user.secret = authenticator.generateSecret();
            this.editorRepository.save(user); // Async is fine here
        }

        const pin = authenticator.generate(user.secret);

        if (!pin) {
            throw new Error();
        }

        this.log.info('Dispatching new pin...');

        this.eventDispatcher.dispatch('pin.issued', {
            pin,
            email,
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

        const pinValid = authenticator.check(pin, user.secret);

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

    private secret(): string {
        return env.app.secret;
    }
}
