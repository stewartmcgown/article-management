import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export abstract class MailSender {

    protected mailer: Mail;

    protected from: string;

    constructor() {
        this.mailer = createTransport({
            sendmail: true,
            newline: 'unix',
        });
    }

}
