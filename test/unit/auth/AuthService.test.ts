import { HttpError } from 'routing-controllers';

import { Editor } from '../../../src/api/models/Editor';
import { AuthService } from '../../../src/auth/AuthService';
import { EventDispatcherMock } from '../lib/EventDispatcherMock';
import { LogMock } from '../lib/LogMock';
import { RepositoryMock } from '../lib/RepositoryMock';

describe('AuthService', () => {

    let authService: AuthService;
    let editorRepository: RepositoryMock<Editor>;
    // let authorRepository: RepositoryMock<Author>;
    let eventDispatcher: EventDispatcherMock;

    let log: LogMock;
    beforeEach(() => {
        log = new LogMock();
        editorRepository = new RepositoryMock<Editor>();
        // authorRepository = new RepositoryMock<Author>();
        eventDispatcher = new EventDispatcherMock();

        authService = new AuthService(log, editorRepository as any, /* authorRepository as any,*/ eventDispatcher as any); // Allows polymorphism
    });

    describe('Pin flow', () => {
        it('request a new pin for non-existent user', async () => {
            expect(authService.issuePin('test@test.org')).rejects.toThrow(HttpError);
        });
    });

});