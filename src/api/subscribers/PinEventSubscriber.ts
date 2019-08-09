import { EventSubscriber, On } from 'event-dispatch';
import { Inject } from 'typedi';

import { AuthSender } from '../../mail/AuthSender';
import { events, PinIssuedEvent } from './events';

@EventSubscriber()
export class PinEventSubscriber {

    constructor(@Inject() private pinSender: AuthSender) {}

    @On(events.pin.issued)
    public onPinIssued(pinEvent: PinIssuedEvent): void {
        this.pinSender.sendPIN(pinEvent);
    }

}
