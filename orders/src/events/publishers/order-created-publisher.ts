// orders\src\events\publishers\order-created-publisher.ts
import { Publisher, Subjects, OrderCreatedEvent } from '@angrychaired/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
