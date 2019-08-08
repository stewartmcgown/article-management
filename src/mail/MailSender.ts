import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Service } from 'typedi';

import { Article } from '../api/models/Article';

export interface MailOptions {

    /**
     * Is this a new article?
     */
    isNew?: boolean;

}

@Service()
export class MailSender {

    private mailer: Mail;

    constructor() {
        this.mailer = createTransport({
            sendmail: true,
            newline: 'unix',
        });
    }

    /**
     * When an article
     * @param article
     */
    public sendArticle(article: Article, options: MailOptions): Promise<any> {
        return this.mailer.sendMail({
            from: 'submissions@ysjournal.com',
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
