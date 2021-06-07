import { Message } from 'node-nats-streaming';
import { Listener } from '../../../common/src/events/base-listener';
import { Subjects, TicketCreatedEvent } from '@angrychaired/common';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data here', data);

    // if all is ok
    msg.ack();
  }
}

export { TicketCreatedListener };
