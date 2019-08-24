import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put
} from 'routing-controllers';

import { Levels } from '../models/enums/Levels';
import { Subject } from '../models/Subject';
import { SubjectService } from '../services/SubjectService';

@Authorized(Levels.JUNIOR)
@JsonController('/subjects')
export class SubjectController {

    constructor(
        private subjectService: SubjectService
    ) { }

    @Get()
    public find(): Promise<Subject[]> {
        return this.subjectService.find();
    }

    @Get('/:id')
    @OnUndefined(Error)
    public one(@Param('id') id: string): Promise<Subject | undefined> {
        return this.subjectService.findOne(id);
    }

    @Authorized(Levels.ADMIN)
    @Post()
    public create(@Body() subject: Subject): Promise<Subject> {
        return this.subjectService.create(subject);
    }

    @Authorized(Levels.ADMIN)
    @Put('/:id')
    public update(@Param('id') id: string, @Body() subject: Subject): Promise<Subject> {
        return this.subjectService.update(id, subject);
    }

    @Authorized(Levels.ADMIN)
    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.subjectService.delete(id);
    }

}
