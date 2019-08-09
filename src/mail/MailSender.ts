import { readFileSync } from 'fs';
import Mustache from 'mustache';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';

import { env } from '../env';

export abstract class MailSender {

    protected mailer: Mail;

    protected from: string;

    constructor() {
        this.mailer = createTransport({
            service: 'gmail',
            auth: {
                user: env.mail.user,
                pass: env.mail.pass,
            },
        });
    }

    /**
     * Renders a template to a string
     *
     * @param templateName a template that resides in ./templates
     * @param data the view to use
     */
    protected render(templateName: string, data: any): string {
        return Mustache.render(readFileSync(path.resolve(__dirname, `templates/${templateName}.mustache`)).toString(), data);
    }

}
