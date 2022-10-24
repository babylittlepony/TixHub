import { NextFunction, Request, Response } from "express";

import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

export const errorHandler = function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof RequestValidationError) {
    const error = err.errors.map((err) => {
      return {
        message: err.msg,
        field: err.param,
      };
    });
    return res.status(400).json({ error });
  }
  if (err instanceof DatabaseConnectionError) {
    return res
      .status(503)
      .json({ errors: [{ message: err.message, field: "database" }] });
  }

  res.status(500).json({ errors: [{ message: "Unknown error has occurred" }] });
};
