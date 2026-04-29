import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";

export const validate = (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    }) as any;

    if (result.body) {
      req.body = result.body;
    }
    if (result.query) {
      Object.defineProperty(req, "query", {
        value: result.query,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    if (result.params) {
      Object.defineProperty(req, "params", {
        value: result.params,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    
    next();
  } catch (error: any) {
    if (error.errors) {
      const message = error.errors.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return next(new AppError(message, HttpStatus.BAD_REQUEST));
    }
    next(error);
  }
};
