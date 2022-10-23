import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Enter valid email!"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 16 })
      .withMessage("Password is not valid!, must be between 4 to 16 character"),
  ],
  (req: Request, res: Response) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).send(error.array());
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
    res.send({});
  }
);

export { router as signUpRouter };
