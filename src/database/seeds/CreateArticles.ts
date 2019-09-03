import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { Article } from '../../api/models/Article';
import { Author } from '../../api/models/Author';
import { Editor } from '../../api/models/Editor';

export class CreateArticles implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();

        for (let i = 0; i < 5; i++) {
            const articles = await factory(Article)().make();
             const editors = await factory(Editor)().seedMany(Math.ceil(Math.random() * 3));
             const authors = await factory(Author)().seedMany(Math.ceil(Math.random() * 3));
            articles.authors = authors;
            articles.editors = editors;
            await em.save(articles);
        }
    }

}
