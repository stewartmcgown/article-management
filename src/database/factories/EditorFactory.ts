import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { Subject } from '../../api/models/Article';
import { Editor, Levels, Positions } from '../../api/models/Editor';

define(Editor, (faker: typeof Faker) => {
    const editor = new Editor();

    const randomEnum = (e: any) => e[
        faker.random.arrayElement(Object.getOwnPropertyNames(e))
    ];

    editor.id = uuid.v4();
    editor.email = faker.internet.email();
    editor.name = faker.name.firstName() + ' ' + faker.name.lastName();
    editor.position = randomEnum(Positions);
    editor.level = Levels.JUNIOR;
    editor.subjects = randomEnum(Subject).toString();

    return editor;
});
