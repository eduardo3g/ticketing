import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@e3gtickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/Order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    message.ack();
  }
}