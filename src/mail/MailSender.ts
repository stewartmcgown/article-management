import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

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

}
