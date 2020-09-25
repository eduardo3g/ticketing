import { Message } from 'node-nats-streaming';
import { 
  Subjects,
  Listener,
  TicketCreatedEvent,
} from '@e3gtickets/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage (data: TicketCreatedEvent['data'], message: Message) {
    const { title, price } = data;

    const ticket = await Ticket.build({
      title,
      price,
    });

    await ticket.save();

    message.ack();
  }
}