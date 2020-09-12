import { Publisher, Subjects, TicketCreatedEvent } from '@e3gtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}