import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { UserNotFoundError } from '../api/errors/UserNotFoundError';
import { AuthorRepository } from '../api/repositories/AuthorRepository';
import { EditorRepository } from '../api/repositories/EditorRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private editorRepository: EditorRepository,
        @OrmRepository() private authorRepository: AuthorRepository
    ) { }

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

        return 'pin';

    }

}
