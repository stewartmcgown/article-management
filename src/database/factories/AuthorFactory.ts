import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { Author } from '../../api/models/Author';
import { Levels } from '../../api/models/enums/Levels';

define(Author, (faker: typeof Faker) => {
    const author = new Author();

    author.id = uuid.v4();
    author.email = faker.internet.email();
    author.name = faker.name.firstName() + ' ' + faker.name.lastName();
    author.biography = faker.lorem.sentence();
    author.school = faker.company.companyName();
    author.country = faker.address.country();
    author.level = Levels.AUTHOR;

    return author;
});