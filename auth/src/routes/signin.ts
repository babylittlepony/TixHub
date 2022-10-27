import express from "express";

import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post("/api/users/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.find({ email });
  if (!user) {
    throw new BadRequestError("User not found, please sign up");
  }
});

export { router as signInRouter };
