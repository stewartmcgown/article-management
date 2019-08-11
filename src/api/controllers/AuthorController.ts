import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';

import { AuthorNotFoundError } from '../errors/AuthorNotFoundError';
import { Author } from '../models/Author';
import { Levels } from '../models/User';
import { AuthorService } from '../services/AuthorService';

@Authorized(Levels.JUNIOR)
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

    @Authorized(Levels.SENIOR)
    @Post()
    public create(@Body() author: Author): Promise<Author> {
        return this.authorService.create(author);
    }

    @Authorized(Levels.SENIOR)
    @Put('/:id')
    public update(@Param('id') id: string, @Body() author: Author): Promise<Author> {
        return this.authorService.update(id, author);
    }

    @Authorized(Levels.ADMIN)
    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.authorService.delete(id);
    }

}
