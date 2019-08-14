import { Service } from 'typedi';

import { Article } from '../api/models/Article';
import { MailSender } from './MailSender';
import { Templates } from './templates';

import Mail = require('nodemailer/lib/mailer');

export interface ArticleOptions {
    isNew: boolean;
}

@Service()
export class ArticleSender extends MailSender {

    /**
     * When an article
     * @param article
     */
    public sendArticle(article: Article, options?: ArticleOptions): Array<Promise<any>> {
        const mailJobs = this.getMailJobs(article, options);

        return mailJobs.map(job => this.mailer.sendMail(job));
    }

    private getMailJobs(article: Article, options: ArticleOptions): Mail.Options[] {
        const jobs = [];

        if (article.editors) {
            const job = this.getMailDefaultOptions(article, options);
            job.to = this.getEditorNames(article);
            jobs.push(job);
        }

        if (article.authors) {
            const job = this.getMailDefaultOptions(article, options);
            job.to = this.getAuthorNames(article);
            jobs.push(job);
        }

        return jobs;
    }

    private getMailDefaultOptions(article: Article, options: ArticleOptions): Mail.Options {
        return {
            from: this.from,
            to: this.getRecipients(article),
            subject: this.getSubject(article, options),
            html: this.getContent(article, options),
        };
    }

    private getContent(article: Article, options: ArticleOptions): string {
        const view = {
            names: this.getRecipientNames(article),
            title: article.title,
            link: article.link,
        };

        return (options && options.isNew) ?
            this.render(Templates['article.created'], view) :
            this.render(Templates['article.updated'], view);
    }

    private getSubject(article: Article, options: ArticleOptions): string {
        return `${article.title} has been ${options.isNew ? 'submitted' : 'updated'}`;
    }

    private getRecipientNames(article: Article): string[] {
        return article.authors.map(auth => auth.email)
            .concat(article.editors ? article.editors.map(edit => edit.email) : []);
    }

    private getRecipients(article: Article): string[] {
        return this.getAuthorNames(article)
            .concat(article.editors ? this.getEditorNames(article) : []);
    }

    private getAuthorNames(article: Article): string[] {
        return article.authors.map(auth => auth.email);
    }

    private getEditorNames(article: Article): string[] {
        return article.editors.map(edit => edit.email);
    }
}
