export class DatabaseConnectionError extends Error {
  error = "Error connecting to Database";
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
