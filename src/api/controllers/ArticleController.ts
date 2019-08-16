import { plainToClass } from 'class-transformer';
import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, UploadedFile
} from 'routing-controllers';
import { ObjectLiteral } from 'typeorm';

import { ArticleNotFoundError } from '../errors/ArticleNotFoundError';
import { Article } from '../models/Article';
import { ArticleDTO } from '../models/dto/ArticleDTO';
import { Editor } from '../models/Editor';
import { Levels } from '../models/enums/Levels';
import { ArticleService } from '../services/ArticleService';
import { ArticleCreateResponse } from './responses/ArticleCreateResponse';
import { ArticlePublishResponse } from './responses/ArticlePublishResponse';

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

    @Authorized(Levels.AUTHOR)
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
    public create(@UploadedFile('file') file: Express.Multer.File, @Body() body: any): Promise<ArticleCreateResponse> {
        const article = plainToClass<ArticleDTO, ObjectLiteral>(ArticleDTO, JSON.parse(body.article) as ObjectLiteral);

        return this.articleService.create(article, file).then(result => ({
            id: result.id,
            title: result.title,
        }));
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

    @Authorized(Levels.ADMIN)
    @Post('/publish/:id')
    public publish(@Param('id') id: string): Promise<ArticlePublishResponse> {
        return this.articleService.publish(id);
    }

    @Authorized(Levels.JUNIOR)
    @Get('/publish/:id')
    @OnUndefined(ArticleNotFoundError)
    public getPublished(@Param('id') id: string): Promise<ArticlePublishResponse> {
        return this.articleService.getPublished(id);
    }

    @Authorized(Levels.SENIOR)
    @Post('/assign/:id')
    @OnUndefined(ArticleNotFoundError)
    public assign(@Param('id') id: string, @Body() editors: Editor[]): Promise<Article> {
        return this.articleService.assign(id, editors);
    }

}
