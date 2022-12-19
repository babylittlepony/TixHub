import { ExpirationCompleteEvent, OrderStatus } from "@tixproject/common"
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { createTicket, createOrder } from "../../../function/create-order"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = await createTicket()
  const order = await createOrder(ticket)

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, order, ticket, data, msg }
}

it("updates the order status to cancelled", async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("ack the message", async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
