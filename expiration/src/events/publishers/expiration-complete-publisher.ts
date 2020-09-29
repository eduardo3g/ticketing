import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent
} from '@e3gtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}