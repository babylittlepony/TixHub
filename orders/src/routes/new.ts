import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tixproject/common";

import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").notEmpty().withMessage("Ticket id not found/provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId); // Find the ticket that user is trying to order by the id
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved(); // Make sure the ticket is not already reserved
    if (isReserved) {
      throw new BadRequestError("Ticket already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); // Set expiration date for order (15 Minutes)

    const order = Order.build({
      // Set the order
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save().then(() => console.log("Order created"));

    new OrderCreatedPublisher(natsWrapper.client).publish({
      // Publish Order Created event with NATS
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).json(order); // Order successfully created
  }
);

export { router as newOrderRouter };
