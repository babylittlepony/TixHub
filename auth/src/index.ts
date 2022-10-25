import express from "express";
import "express-async-errors";
import morgan from "morgan";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";

import { errorHandler } from "./middleware/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const url = "mongodb://auth-mongo-srv:27017/auth";
const startDB = async () => {
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
});
startDB();
