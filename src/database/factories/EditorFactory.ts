import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { Editor } from '../../api/models/Editor';
import { Levels } from '../../api/models/enums/Levels';

define(Editor, (faker: typeof Faker) => {
    const editor = new Editor();

    const randomEnum = (e: any) => e[
        faker.random.arrayElement(Object.getOwnPropertyNames(e))
    ];

    editor.id = uuid.v4();
    editor.email = faker.internet.email();
    editor.name = faker.name.firstName() + ' ' + faker.name.lastName();
    editor.level = Levels.JUNIOR;
    editor.subjects = 'Physics';

    return editor;
});
