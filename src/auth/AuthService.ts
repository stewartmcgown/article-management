import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { UserNotFoundError } from 'src/api/errors/UserNotFoundError';
import { AuthorRepository } from 'src/api/repositories/AuthorRepository';
import { EditorService } from 'src/api/services/EditorService';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User } from '../api/models/User';
import { EditorRepository } from '../api/repositories/EditorRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private editorRepository: EditorRepository,
        @OrmRepository() private authorRepository: AuthorRepository
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

    /**
     *
     *
     * @param email email to issue for
     */
    public async issuePin(email: string): Promise<string> {
       const user = this.editorRepository.findOne({
           where: {
               email,
           },
       }) || this.authorRepository.findOne({
           where: {
               email,
           },
       });

       if (!user) {
           throw new UserNotFoundError();
        }

        return 'token';

    }

}
