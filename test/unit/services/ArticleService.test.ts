import { Article } from '../../../src/api/models/Article';
import { Status } from '../../../src/api/models/enums/Status';
import { ArticleService } from '../../../src/api/services/ArticleService';
import { events } from '../../../src/api/subscribers/events';
import { EventDispatcherMock } from '../lib/EventDispatcherMock';
import { LogMock } from '../lib/LogMock';
import { RepositoryMock } from '../lib/RepositoryMock';

import uuid = require('uuid');

describe('ArticleService', () => {

    test('Find should return a list of articles', async (done) => {
        const log = new LogMock();
        const repo = new RepositoryMock();
        const ed = new EventDispatcherMock();
        const article = new Article();
        article.id = uuid.v4();
        article.status = Status['Failed Data Check'];

        repo.list = [article];
        const articleService = new ArticleService(repo as any, ed as any, log);
        const list = await articleService.find();
        expect(list[0].status).toBe(article.status);
        done();
    });

});
