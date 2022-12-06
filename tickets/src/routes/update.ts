import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from "@tixproject/common";

import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage("Invalid price, must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      // Update the Ticket
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save(); // Save the Ticket
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      // Publish the Ticket
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
    });

    res.status(200).json(ticket);
  }
);

export { router as updateTicketRouter };
