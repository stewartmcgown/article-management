import Container from 'typedi';

import { Article } from '../../../src/api/models/Article';
import { Author } from '../../../src/api/models/Author';
import { Editor } from '../../../src/api/models/Editor';
import { ArticleSender } from '../../../src/mail/ArticleSender';
import { MailSender } from '../../../src/mail/MailSender';

describe("Mail functionality", () => {

    const mockAuthor = () => {
        const a = new Author();
        a.email = 'test@test.org';
        return a;
    };

    const mockEditor = () => {
        const a = new Editor();
        a.email = 'test@test.org';
        return a;
    };

    let mailService: MailSender;

    beforeAll(() => {
        mailService = Container.get<MailSender>(ArticleSender);
    });

    test("Recipients should be authors and editors", () => {

        const article = new Article();
        article.authors = new Array(2).fill(mockAuthor());
        article.editors = new Array(2).fill(mockEditor());

        const recipients = mailService['getRecipients'](article);

        expect(recipients.length).toBe(4);
        expect(recipients).toEqual(new Array(4).fill('test@test.org'));
    });

});
