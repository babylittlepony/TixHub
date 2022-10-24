import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/custom-error";

export const errorHandler = function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeError() });
  }

  res.status(500).json({ errors: [{ message: "Unknown error has occurred" }] });
};
