import { Request } from 'express';
import MockExpressRequest from 'mock-express-request';
import { Author } from 'src/api/models/Author';
import { Editor } from 'src/api/models/Editor';
import { EditorRepository } from 'src/api/repositories/EditorRepository';

import { AuthService } from '../../../src/auth/AuthService';
import { LogMock } from '../lib/LogMock';
import { RepositoryMock } from '../lib/RepositoryMock';

describe('AuthService', () => {

    let authService: AuthService;
    let editorRepository: RepositoryMock<Editor>;
    let authorRepository: RepositoryMock<Author>;
    let log: LogMock;
    beforeEach(() => {
        log = new LogMock();
        editorRepository = new RepositoryMock<Editor>();
        authorRepository = new RepositoryMock<Author>();

        authService = new AuthService(log, editorRepository as any, authorRepository as any); // Allows polymorphism
    });

    describe('Pin flow', () => {
        it('request a new pin', async () => {
            expect(await authService.issuePin('test@test.org')).toBeTruthy();
        });
    });

});
