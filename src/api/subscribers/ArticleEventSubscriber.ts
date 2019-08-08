import { EventSubscriber, On } from 'event-dispatch';
import { MailSender } from 'src/mail/MailSender';
import { Inject } from 'typedi';

import { Logger } from '../../lib/logger';
import { Article } from '../models/Article';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class ArticleEventSubscriber {

    constructor(@Inject() private mailSender: MailSender) {}

    @On(events.article.created)
    public onArticleCreate(article: Article): void {
        log.info('Article ' + article.toString() + ' created!');
        this.mailSender.sendArticle(article, {
            isNew: true,
        })
    }

    @On(events.article.updated)
    public onArticleUpdated(article: Article): void {
        log.info('Article ' + article.toString() + ' updated!');
    }

}
