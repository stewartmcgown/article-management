import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';

import { AuthorNotFoundError } from '../errors/AuthorNotFoundError';
import { Author } from '../models/Author';
import { AuthorService } from '../services/AuthorService';

@Authorized()
@JsonController('/authors')
export class AuthorController {

    constructor(
        private authorService: AuthorService
    ) { }

    @Get()
    public find(): Promise<Author[]> {
        return this.authorService.find();
    }

    @Get('/me')
    public findMe(@Req() req: any): Promise<Author[]> {
        return req.author;
    }

    @Get('/:id')
    @OnUndefined(AuthorNotFoundError)
    public one(@Param('id') id: string): Promise<Author | undefined> {
        return this.authorService.findOne(id);
    }

    @Post()
    public create(@Body() author: Author): Promise<Author> {
        return this.authorService.create(author);
    }

    @Put('/:id')
    public update(@Param('id') id: string, @Body() author: Author): Promise<Author> {
        return this.authorService.update(id, author);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.authorService.delete(id);
    }

}
