export class DatabaseConnectionError extends Error {
  message = "Error connecting to Database";
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
