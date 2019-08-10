import { plainToClass } from 'class-transformer';
import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, UploadedFile
} from 'routing-controllers';

import { ArticleNotFoundError } from '../errors/ArticleNotFoundError';
import { Article } from '../models/Article';
import { Levels } from '../models/Editor';
import { ArticleService } from '../services/ArticleService';

@JsonController('/articles')
export class ArticleController {

    constructor(
        private articleService: ArticleService
    ) { }

    @Authorized(Levels.JUNIOR)
    @Get()
    public find(): Promise<Article[]> {
        return this.articleService.find();
    }

    @Authorized(Levels.JUNIOR)
    @Get('/me')
    public findMe(@Req() req: any): Promise<Article[]> {
        return req.article;
    }

    @Authorized(Levels.JUNIOR)
    @Get('/:id')
    @OnUndefined(ArticleNotFoundError)
    public one(@Param('id') id: string): Promise<Article | undefined> {
        return this.articleService.findOne(id);
    }

    @Post()
    public create(@UploadedFile('file') file: Express.Multer.File,
                  // @UploadedFiles('photos[]') photo: Express.Multer.File[],
                  @Body() body: any): Promise<Article> {
        const article = plainToClass(Article, JSON.parse(body.article)) as any;
        return this.articleService.create(article as Article, file);
    }

    @Authorized(Levels.JUNIOR)
    @Put('/:id')
    public update(@Param('id') id: string, @Body() article: Article): Promise<Article> {
        return this.articleService.update(id, article);
    }

    @Authorized(Levels.ADMIN)
    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.articleService.delete(id);
    }

}
