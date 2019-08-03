import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Article } from '../models/Article';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { events } from '../subscribers/events';

@Service()
export class ArticleService {

    constructor(
        @OrmRepository() private articleRepository: ArticleRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Article[]> {
        this.log.info('Find all articles');
        return this.articleRepository.find({ relations: ['editors', 'authors'] });
    }

    public findOne(id: string): Promise<Article | undefined> {
        this.log.info('Find one article');
        return this.articleRepository.findOne({ id });
    }

    public async create(article: Article): Promise<Article> {
        this.log.info('Create a new article => ', article.toString());
        article.id = uuid.v1();
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
