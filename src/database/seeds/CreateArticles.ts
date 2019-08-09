import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { Article, Status, Subject, Type } from '../../api/models/Article';

export class CreateArticles implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();

        for (let i = 0; i < 100; i++) {
            const article = new Article();

            article.id = uuid.v4();
            article.date = new Date();
            article.title = 'An Article';
            article.type = Type['Original Research'];
            article.status = Status['In Review'];
            article.subject = Subject['Computer Science'];
            article.docId = 'doc-id';
            article.folderId = 'folder-id';
            article.markingGridId = 'marking-id';
            article.summary = 'summary!';
            article.modified = new Date();

            await em.save(article);
        }
    }

}
