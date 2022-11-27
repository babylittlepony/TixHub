import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, extractJwt } from "@tixproject/common";

import { indexOrderRouter } from "./routes/index";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

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
app.use(extractJwt);
/*-----------Middleware-----------*/

/*-----------Routes-----------*/
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);
/*-----------Routes-----------*/

/*-----------Error-----------*/
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);
/*-----------Error-----------*/

export { app };
