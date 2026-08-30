import { Request, Response, NextFunction } from "express";
import { appConfig } from "../../infrastructure/config/appConfig";
import { ErrorMapper } from "../mappers/ErrorMapper";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isDevelopment = appConfig.get("NODE_ENV") === "development";
  
  if (isDevelopment) {
    console.error("Global Error Handler caught an error:", err);
  }

  const { status, body } = ErrorMapper.toResponse(err, isDevelopment);
  res.status(status).json(body);
};
