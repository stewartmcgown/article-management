import { validate } from 'class-validator';

import { AbstractModel } from '../models/AbstractModel';
import { AbstractDTO } from '../models/dto/AbstractDTO';

export abstract class AbstractService<D extends AbstractDTO, E extends AbstractModel> {

    constructor(private modelFactory: (new () => E)) { }

    protected async dtoToClass(dto: D): Promise<E> {
        const validationErrors = await validate(dto);
        if (validationErrors.length) {
            throw validationErrors;
        }

        // DTO -> Class
        const entity = new this.modelFactory();
        Object.assign(entity, dto);

        return entity;
    }
}
