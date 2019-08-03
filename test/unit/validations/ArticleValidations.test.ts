import { validate } from 'class-validator';

import { Article, Status } from '../../../src/api/models/Article';

describe('ArticleValidations', () => {

    test('Article should always have a status', async (done) => {
        const article = new Article();
        const errorsOne = await validate(article);
        article.status = Status['Failed Data Check'];
        const errorsTwo = await validate(article);
        expect(errorsOne.length).toBeGreaterThan(errorsTwo.length);
        done();
    });

});
