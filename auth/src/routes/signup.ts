import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";

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
    const { email, password } = req.body;

    if (!error.isEmpty()) {
      throw new RequestValidationError(error.array());
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email is in use");
      throw new BadRequestError("Email is in use");
    }

    const user = User.build({ email, password });
    await user
      .save()
      .then((data) => {
        // Generate JWT
        const userJwt = jwt.sign(
          {
            id: data.id,
            email: data.email,
          },
          "averythiiieeeckkksecretkey"
        );
        // Store JWT in session
        req.session = {
          jwt: userJwt,
        };

        console.log(
          "User created!",
          "\n",
          "Email: ",
          data.email,
          "\n",
          "Password: ",
          data.password
        );
      })
      .catch((error) => console.log(error));

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
