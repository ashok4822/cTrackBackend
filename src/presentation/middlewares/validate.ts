import { Request, Response, NextFunction } from "express";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";

/**
 * Higher-order middleware for data validation.
 * Agnostic of the underlying validation library.
 *
 * @param schema The schema object to validate against
 * @param validator A bound validate function from an ISchemaValidator instance
 */
export const validate = (schema: unknown, validator: (schema: unknown, data: unknown) => unknown) =>
  (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = validator(schema, {
      body: req.body,
      query: req.query,
      params: req.params,
    }) as Record<string, unknown>;

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
  } catch (error: unknown) {
    // Handle ZodError-shaped objects (has an `issues` array) without importing Zod
    if (error !== null && typeof error === "object" && "issues" in error) {
      const issues = (error as { issues: Array<{ path: string[]; message: string }> }).issues;
      const message = issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return next(new AppError(message, HttpStatus.BAD_REQUEST));
    }

    if (error instanceof Error) {
      return next(new AppError(error.message, HttpStatus.BAD_REQUEST));
    }

    next(error);
  }
};
