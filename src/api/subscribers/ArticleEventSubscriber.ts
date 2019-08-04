import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { Article } from '../models/Article';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class ArticleEventSubscriber {

    @On(events.article.created)
    public onArticleCreate(article: Article): void {
        log.info('Article ' + article.toString() + ' created!');
    }

    @On(events.article.updated)
    public onArticleUpdated(article: Article): void {
        log.info('Article ' + article.toString() + ' updated!');
    }

}
