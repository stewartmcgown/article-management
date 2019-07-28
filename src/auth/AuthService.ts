import * as express from 'express';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User } from '../api/models/User';
import { EditorRepository } from '../api/repositories/EditorRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository
    ) { }

    public async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                username,
            },
        });

        // TODO: Check for correct authToken
        return user;
    }

}
