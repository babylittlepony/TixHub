import express from "express";
import "express-async-errors";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";

import { errorHandler } from "./middleware/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

const url = "mongodb://auth-mongo-srv:27017/auth";
const startDB = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt secret key not found");
  }

  try {
    await mongoose.connect(url);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth on 3000, v8");
  startDB();
});
