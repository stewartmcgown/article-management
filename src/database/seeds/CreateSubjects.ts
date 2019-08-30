import { Connection } from 'typeorm';
import { Factory, Seeder, times } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { Editor } from '../../api/models/Editor';
import { Levels } from '../../api/models/enums/Levels';
import { Positions } from '../../api/models/enums/Positions';
import { Subject } from '../../api/models/Subject';

export class CreateSubjects implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();

        const subjects = [
            'Biology',
            'Chemistry',
            'Computer Science',
            'Engineering',
            'Environmental & Earth Science',
            'Materials Science',
            'Mathematics',
            'Medicine',
            'Physics',
            'Policy & Ethics',
        ]

        subjects.forEach(sub => {
            const subject = new Subject();
            subject.id = uuid.v1();
            subject.name = sub;
            em.save(subject).then(r => r);
        })
    }

}
