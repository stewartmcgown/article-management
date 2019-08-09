import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { Article, Status, Subject, Type } from '../../api/models/Article';

define(Article, (faker: typeof Faker) => {
    const article = new Article();

    const randomEnum = (e: any) => e[
            faker.random.arrayElement(Object.getOwnPropertyNames(e))
        ];

    article.id = uuid.v4();
    article.date = new Date();
    article.title = faker.lorem.sentence();
    article.type = randomEnum(Type);
    article.status = randomEnum(Status);
    article.subject = randomEnum(Subject);
    article.docId = faker.phone.phoneNumber();
    article.folderId = faker.phone.phoneNumber();
    article.markingGridId = faker.phone.phoneNumber();
    article.summary = faker.lorem.paragraph();
    article.modified = new Date();

    return article;
});
