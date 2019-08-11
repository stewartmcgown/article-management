import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { validate, validated } from '../../decorators/Validate';
import { env } from '../../env';
import { Drive } from '../../google/Drive';
import { WordpressService } from '../../lib/wordpress';
import { ArticlePublishResponse } from '../controllers/responses/ArticlePublishResponse';
import { Article } from '../models/Article';
import { ArticleDTO } from '../models/dto/ArticleDTO';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { events } from '../subscribers/events';
import { AbstractService } from './AbstractService';

@Service()
export class ArticleService extends AbstractService<ArticleDTO, Article> {

    constructor(
        @OrmRepository() private articleRepository: ArticleRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface,
        private driveService: Drive,
        private wordpressService: WordpressService
    ) { super(Article); }

    public find(): Promise<Article[]> {
        this.log.info('Find all articles');
        return this.articleRepository.find({ relations: ['editors', 'authors'] });
    }

    public findOne(id: string): Promise<Article | undefined> {
        this.log.info('Find one article');
        return this.articleRepository.findOne({ id });
    }

    @validated()
    public async create(@validate() articleDto: ArticleDTO, file: Express.Multer.File): Promise<Article> {

        // DTO -> Class
        const article = new Article();
        Object.assign(article, articleDto);

        this.log.info('Create a new article => ', article.toString());

        const folderId = await this.driveService.createFolder({
            name: article.title,
            parentId: env.google.parent,
        });

        article.folderId = folderId;

        const docId = await this.driveService.createFile({
            name: article.title,
            file,
            mimeType: 'application/vnd.google-apps.document',
            parentId: folderId,
        });

        article.docId = docId;

        const markingGridId = await this.driveService.copy({
            source: env.google.marking_grid,
            dest: folderId,
            name: `Marking Grid for ${article.title}`,
        });

        article.markingGridId = markingGridId;

        // Process permissions asynchronously
        for (const { email } of article.authors) {
            this.driveService.shareFile({
                id: docId,
                role: 'writer',
                email,
            });
        }

        article.id = uuid.v4();
        const newArticle = await this.articleRepository.save(article);
        this.eventDispatcher.dispatch(events.article.created, newArticle);
        return newArticle;
    }

    public update(id: string, article: Article): Promise<Article> {
        this.log.info('Update a article');
        article.id = id;
        return this.articleRepository.save(article);
    }

    public async delete(id: string): Promise<void> {
        this.log.info('Delete a article');
        await this.articleRepository.delete(id);
        return;
    }

    public async publish(id: string): Promise<ArticlePublishResponse> {
        const article = await this.articleRepository.findOne(id);
        const wordpress = await this.wordpressService.publishArticle(article);
        return {
            article,
            wordpress,
        };
    }

}
