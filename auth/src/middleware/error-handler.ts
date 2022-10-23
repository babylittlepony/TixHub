import { NextFunction, Request, Response } from "express";

export const errorHandler = function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Something went wrong!");
  res.status(400).json({ message: err.message });
};
