import { validateSync } from 'class-validator';

import { Author } from '../../../src/api/models/Author';

describe('AuthorValidations', () => {

    test('a bad author should fail', () => {
        const author = new Author();
        author.name = 'Name!';
        author.email = 'email@email.org';
        author.country = 'UK';
        author.biography = 'Whatever';

        const errors = validateSync(author);
        console.log(errors);
        expect(errors.length).toBeGreaterThan(0);
    });

});
