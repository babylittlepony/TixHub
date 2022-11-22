import express, { Request, Response } from "express";
import mongoose from "mongoose";

import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tixproject/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  body("ticketId")
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // Check the Ticket id is valid Mongo id
    .withMessage("Ticket id not found/provided"),
  validateRequest,
  async (res: Response, req: Request) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId); // Find the ticket that user is trying to order by the id
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved(); // Make sure the ticket is not already reserved
    if (isReserved) {
      throw new BadRequestError("Ticket already reserved");
    }
  }
);

export { router as newOrderRouter };
