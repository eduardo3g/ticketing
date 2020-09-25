import { Message } from 'node-nats-streaming';
import { 
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from '@e3gtickets/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage (data: TicketUpdatedEvent['data'], message: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }    

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    message.ack();
  }
}