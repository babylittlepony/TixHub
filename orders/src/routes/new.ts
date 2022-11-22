import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { requireAuth, validateRequest } from "@tixproject/common";
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
    res.json();
  }
);

export { router as newOrderRouter };
