import { Service } from 'typedi';

import { Article } from '../api/models/Article';
import { MailSender } from './MailSender';
import { Templates } from './templates';

export interface ArticleOptions {
    isNew: boolean;
}

@Service()
export class ArticleSender extends MailSender {
    /**
     * When an article
     * @param article
     */
    public sendArticle(article: Article, options: ArticleOptions): Promise<any> {
        return this.mailer.sendMail({
            from: this.from,
            to: this.getRecipients(article),
            subject: this.getSubject(article),
            html: this.getContent(article, options),
        });
    }

    private getContent(article: Article, options: ArticleOptions): string {
        const view = {
            names: this.getRecipientNames(article),
            title: article.title,
            link: article.link,
        };

        return options.isNew ?
            this.render(Templates['article.created'], view) :
            this.render(Templates['article.updated'], view);
    }

    private getSubject(article: Article): string {
        return `${article.title} has been updated`;
    }

    private getRecipientNames(article: Article): string[] {
        return article.authors.map(auth => auth.email)
            .concat(article.editors ? article.editors.map(edit => edit.email) : []);
    }

    private getRecipients(article: Article): string[] {
        return article.authors.map(auth => auth.email)
            .concat(article.editors ? article.editors.map(edit => edit.email) : []);
    }
}
