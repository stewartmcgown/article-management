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
            html: `Dear ${pinEvent.user.name},
                <br />
                Your one-time PIN is <b>${pinEvent.pin}</b>.

                Never reveal your PIN to anyone.

                It will expire in one minute.

                - Submissions Team
            `,
        });
    }
}
