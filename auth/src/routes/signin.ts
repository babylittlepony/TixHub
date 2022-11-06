import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError, validateRequest } from "@tixproject/common";

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

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid credentials");
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) {
      console.log("Invalid credentials");
      throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.jwt_key!
    );
    // Store JWT in session
    req.session = {
      jwt: userJwt,
    };

    console.log("Login success");
    res.status(200).json({ message: "Login success" });
  }
);

export { router as signInRouter };
