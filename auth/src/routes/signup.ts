import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Enter valid email!"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 16 })
      .withMessage("Enter valid password!, must be between 4 to 16 character"),
  ],
  async (req: Request, res: Response) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      throw new RequestValidationError(error.array());
    }

    const { email, password } = req.body;

    console.log(
      "User created!",
      "\n",
      "Email: ",
      email,
      "\n",
      "Password: ",
      password
    );

    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signUpRouter };
