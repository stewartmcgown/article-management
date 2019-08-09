import { Service } from 'typedi';

import { Article } from '../api/models/Article';
import { MailSender } from './MailSender';

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
            text: this.getContent(article),
        });
    }

    private getContent(article: Article): string {
        return `Dear You, article has been updated.`;
    }

    private getSubject(article: Article): string {
        return `${article.title} has been updated`;
    }

    private getRecipients(article: Article): string[] {
        return article.authors.map(auth => auth.email)
            .concat(article.editors.map(edit => edit.email));
    }
}
