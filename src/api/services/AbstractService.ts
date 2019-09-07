import { DeepPartial, Repository } from 'typeorm';

import { AbstractModel } from '../models/AbstractModel';

import uuid = require('uuid');

/**
 * A simple abstraction for a service. Doesn't handle emitted events due to limitations
 * of the untyped EventDispatcher.
 */
export abstract class AbstractService<M extends AbstractModel> {

    constructor(protected repository: Repository<M>) { }

    public find(): Promise<M[]> {
        return this.repository.find();
    }

    public findOne(id: string): Promise<M | undefined> {
        return this.repository.findOne(id);
    }

    public async create(model: M): Promise<M> {
        model.id = uuid.v1();
        await this.repository.save(model as unknown as DeepPartial<M>); // Dirty typeorm tricks
        return model;
    }

    public update(id: string, model: M): Promise<M> {
        model.id = id;
        return this.repository.save(model as unknown as DeepPartial<M>);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
        return;
    }
}
