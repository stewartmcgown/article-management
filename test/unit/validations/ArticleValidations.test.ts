import { validate } from 'class-validator';

import { Article } from '../../../src/api/models/Article';
import { Status } from '../../../src/api/models/enums/Status';

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
