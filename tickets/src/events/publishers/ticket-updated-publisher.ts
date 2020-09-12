import { Publisher, Subjects, TicketUpdatedEvent } from '@e3gtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}