import express, { Request, Response } from "express";
import { body } from "express-validator";

import { BadRequestError } from "../errors/bad-request-error";

import { validateRequest } from "../middleware/validate-request";

import { User } from "../models/user";

import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Enter valid email!"),
    body("password").trim().notEmpty().withMessage("Enter valid password!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.find({ email });
    if (!user) {
      throw new BadRequestError("User not found, please sign up");
    }
  }
);

export { router as signInRouter };
