import { HttpStatus } from "../../shared/constants/HttpStatus";

export class AppError extends Error {

  public readonly isOperational: boolean;

  constructor(
    public message: string,
    public statusCode: number = HttpStatus.BAD_REQUEST,

    isOperational: boolean = true
  ) {
    super(message);
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
