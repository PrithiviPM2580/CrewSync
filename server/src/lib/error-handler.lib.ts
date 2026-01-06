export class APIError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly error: APIErrorType | undefined;

  constructor(
    statusCode: number = 500,
    message: string = "Internal Server Error",
    isOperational: boolean = true,
    error?: APIErrorType,
    stack?: string
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
