import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  constructor() {
    super("DB connection failed");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  message = "Error connecting to Database";
  statusCode = 503;
  serializeError() {
    return [{ message: this.message, field: "Database" }];
  }
}
