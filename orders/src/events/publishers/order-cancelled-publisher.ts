import { Publisher, OrderCancelledEvent, Subjects } from '@e3gtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
};