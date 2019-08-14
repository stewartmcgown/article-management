import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { Editor } from '../../api/models/Editor';
import { Levels } from '../../api/models/enums/Levels';
import { Positions } from '../../api/models/enums/Positions';

export class CreateStewart implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();

        const user = new Editor();
        user.id = uuid.v1();
        user.email = 'stewart@twistedcore.co.uk';
        user.name = 'Stewart McGown';
        user.level = Levels.ADMIN;
        user.position = Positions.EDITOR;
        user.subjects = 'Computer Science';
        return em.save(user);
    }

}
