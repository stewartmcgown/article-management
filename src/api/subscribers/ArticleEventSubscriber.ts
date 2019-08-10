import { EventSubscriber, On } from 'event-dispatch';
import Container from 'typedi';

import { Logger } from '../../lib/logger';
import { ArticleSender } from '../../mail/ArticleSender';
import { Article } from '../models/Article';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class ArticleEventSubscriber {

    constructor(private articleSender: ArticleSender) {
        this.articleSender = Container.get(ArticleSender);
    }

    @On(events.article.created)
    public onArticleCreate(article: Article): void {
        log.info('Article ' + article.toString() + ' created!');
        this.articleSender.sendArticle(article, {
            isNew: true,
        });
    }

    @On(events.article.updated)
    public onArticleUpdated(article: Article): void {
        log.info('Article ' + article.toString() + ' updated!');
    }

}
