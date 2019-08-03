import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';

import { ArticleNotFoundError } from '../errors/ArticleNotFoundError';
import { Article } from '../models/Article';
import { ArticleService } from '../services/ArticleService';

@Authorized()
@JsonController('/articles')
export class ArticleController {

    constructor(
        private articleService: ArticleService
    ) { }

    @Get()
    public find(): Promise<Article[]> {
        return this.articleService.find();
    }

    @Get('/me')
    public findMe(@Req() req: any): Promise<Article[]> {
        return req.article;
    }

    @Get('/:id')
    @OnUndefined(ArticleNotFoundError)
    public one(@Param('id') id: string): Promise<Article | undefined> {
        return this.articleService.findOne(id);
    }

    @Post()
    public create(@Body() article: Article): Promise<Article> {
        return this.articleService.create(article);
    }

    @Put('/:id')
    public update(@Param('id') id: string, @Body() article: Article): Promise<Article> {
        return this.articleService.update(id, article);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.articleService.delete(id);
    }

}
