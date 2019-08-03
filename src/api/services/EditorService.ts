import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Editor } from '../models/Editor';
import { EditorRepository } from '../repositories/EditorRepository';
import { events } from '../subscribers/events';

@Service()
export class EditorService {

    constructor(
        @OrmRepository() private editorRepository: EditorRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Editor[]> {
        this.log.info('Find all editors');
        return this.editorRepository.find();
    }

    public findOne(id: string): Promise<Editor | undefined> {
        this.log.info('Find one editor');
        return this.editorRepository.findOne({ id });
    }

    public async create(editor: Editor): Promise<Editor> {
        this.log.info('Create a new editor => ', editor.toString());
        editor.id = uuid.v1();
        const newEditor = await this.editorRepository.save(editor);
        this.eventDispatcher.dispatch(events.editor.created, newEditor);
        return newEditor;
    }

    public update(id: string, editor: Editor): Promise<Editor> {
        this.log.info('Update a editor');
        editor.id = id;
        return this.editorRepository.save(editor);
    }

    public async delete(id: string): Promise<void> {
        this.log.info('Delete a editor');
        await this.editorRepository.delete(id);
        return;
    }

}
