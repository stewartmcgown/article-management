import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { events, PinIssuedEvent } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class PinEventSubscriber {

    @On(events.pin.issued)
    public onArticleIssue(pinEvent: PinIssuedEvent): void {
        log.info(pinEvent.email);
    }

}
