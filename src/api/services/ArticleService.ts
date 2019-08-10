import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { Drive } from '../../google/Drive';
import { Article } from '../models/Article';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { events } from '../subscribers/events';

@Service()
export class ArticleService {

    constructor(
        @OrmRepository() private articleRepository: ArticleRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface,
        private driveService: Drive
    ) { }

    public find(): Promise<Article[]> {
        this.log.info('Find all articles');
        return this.articleRepository.find({ relations: ['editors', 'authors'] });
    }

    public findOne(id: string): Promise<Article | undefined> {
        this.log.info('Find one article');
        return this.articleRepository.findOne({ id });
    }

    public async create(article: Article, file: Express.Multer.File): Promise<Article> {
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

            this.driveService.shareFile({
                id: markingGridId,
                role: 'reader',
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

}
