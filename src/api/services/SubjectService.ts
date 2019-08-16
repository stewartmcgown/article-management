import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Subject } from '../models/Subject';
import { SubjectRepository } from '../repositories/SubjectRepository';
import { events } from '../subscribers/events';

@Service()
export class SubjectService {

    constructor(
        @OrmRepository() private subjectRepository: SubjectRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ) { }

    public find(): Promise<Subject[]> {
        return this.subjectRepository.find();
    }

    public findOne(id: string): Promise<Subject | undefined> {
        return this.subjectRepository.findOne({ id });
    }

    public async create(subject: Subject): Promise<Subject> {
        subject.id = uuid.v1();
        const newSubject = await this.subjectRepository.save(subject);
        this.eventDispatcher.dispatch(events.subject.created, newSubject);
        return newSubject;
    }

    public update(id: string, subject: Subject): Promise<Subject> {
        subject.id = id;
        return this.subjectRepository.save(subject);
    }

    public async delete(id: string): Promise<void> {
        await this.subjectRepository.delete(id);
        return;
    }

}
