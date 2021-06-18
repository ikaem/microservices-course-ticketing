// orders\src\events\publishers\order-cancelled-publisher.ts
import { Publisher, Subjects, OrderCancelledEvent } from '@angrychaired/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
