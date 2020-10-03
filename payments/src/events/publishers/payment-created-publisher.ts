import {
  Subjects,
  Publisher,
  PaymentCreatedEvent
} from '@e3gtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}