import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put
} from 'routing-controllers';

import { Levels } from '../models/enums/Levels';
import { Subject } from '../models/Subject';
import { SubjectService } from '../services/SubjectService';

@Authorized(Levels.JUNIOR)
@JsonController('/editors')
export class SubjectController {

    constructor(
        private editorService: SubjectService
    ) { }

    @Get()
    public find(): Promise<Subject[]> {
        return this.editorService.find();
    }

    @Get('/:id')
    @OnUndefined(Error)
    public one(@Param('id') id: string): Promise<Subject | undefined> {
        return this.editorService.findOne(id);
    }

    @Authorized(Levels.ADMIN)
    @Post()
    public create(@Body() editor: Subject): Promise<Subject> {
        return this.editorService.create(editor);
    }

    @Authorized(Levels.ADMIN)
    @Put('/:id')
    public update(@Param('id') id: string, @Body() editor: Subject): Promise<Subject> {
        return this.editorService.update(id, editor);
    }

    @Authorized(Levels.ADMIN)
    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.editorService.delete(id);
    }

}
