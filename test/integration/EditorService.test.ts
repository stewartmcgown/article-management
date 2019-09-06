import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { Editor } from '../../src/api/models/Editor';
import { Levels } from '../../src/api/models/enums/Levels';
import { EditorService } from '../../src/api/services/EditorService';
import { closeDatabase, createDatabaseConnection, migrateDatabase } from '../utils/database';
import { configureLogger } from '../utils/logger';

import uuid = require('uuid');
describe('EditorService', () => {

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    let connection: Connection;
    beforeAll(async () => {
        configureLogger();
        connection = await createDatabaseConnection();
    });
    beforeEach(() => migrateDatabase(connection));

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(() => closeDatabase(connection));

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    test('should create a new editor in the database', async (done) => {
        const editor = new Editor();
        editor.id = uuid.v4();
        editor.name = 'test';
        editor.level = Levels.JUNIOR;
        const service = Container.get<EditorService>(EditorService);
        const resultCreate = await service.create(editor);

        expect(resultCreate).toEqual(editor);

        const resultFind = await service.findOne(resultCreate.id);
        if (resultFind) {
            expect(resultCreate).toEqual(editor);
        } else {
            fail('Could not find editor');
        }
        done();
    });

});
