import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@tixproject/common";

import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket"); // Get order by id with linked ticket

    if (!order) {
      // Throw not found error to order
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      // Throw not authorized if not the same user
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled; // Set order status to cancelled
    await order.save().then(() => console.log("Order cancelled"));

    new OrderCancelledPublisher(natsWrapper.client).publish({
      // Publish Order Cancelled event with NATS
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).json({}); // 204 = Deleted status code
  }
);

export { router as deleteOrderRouter };
