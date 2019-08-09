import { Service } from 'typedi';

import { PinIssuedEvent } from '../api/subscribers/events';
import { MailSender } from './MailSender';

@Service()
export class AuthSender extends MailSender {

    public sendPIN(pinEvent: PinIssuedEvent): void {
        this.mailer.sendMail({
            from: this.from,
            to: pinEvent.user.email,
            subject: `Your AMS Pin`,
            html: this.render('pin', pinEvent),
        });
    }
}
