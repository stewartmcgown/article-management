import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';

import { EditorNotFoundError } from '../errors/EditorNotFoundError';
import { Editor } from '../models/Editor';
import { EditorService } from '../services/EditorService';

@Authorized()
@JsonController('/editors')
export class EditorController {

    constructor(
        private editorService: EditorService
    ) { }

    @Get()
    public find(): Promise<Editor[]> {
        return this.editorService.find();
    }

    @Get('/me')
    public findMe(@Req() req: any): Promise<Editor[]> {
        return req.editor;
    }

    @Get('/:id')
    @OnUndefined(EditorNotFoundError)
    public one(@Param('id') id: string): Promise<Editor | undefined> {
        return this.editorService.findOne(id);
    }

    @Post()
    public create(@Body() editor: Editor): Promise<Editor> {
        return this.editorService.create(editor);
    }

    @Put('/:id')
    public update(@Param('id') id: string, @Body() editor: Editor): Promise<Editor> {
        return this.editorService.update(id, editor);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.editorService.delete(id);
    }

}
