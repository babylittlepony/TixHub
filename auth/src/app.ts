import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";

import { errorHandler, NotFoundError } from "@tixproject/common";

const app = express();

app.set("trust proxy", true);

/*-----------Middleware-----------*/
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
/*-----------Middleware-----------*/

/*-----------Routes-----------*/
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
/*-----------Routes-----------*/

/*-----------Error-----------*/
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);
/*-----------Error-----------*/

export { app };
