import { Publisher, OrderCreatedEvent, Subjects } from '@e3gtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
};