import { Listener, OrderCreatedEvent, Subjects } from "@tixproject/common";
import { Message } from "node-nats-streaming";

import { expirationQueue } from "../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add({
      orderId: data.id,
    });
  }
}
