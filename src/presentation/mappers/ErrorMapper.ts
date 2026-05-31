import { z } from "zod";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class ErrorMapper {
  /**
   * Maps an error to a standardized ApiResponse object.
   */
  static toResponse(err: unknown, isDevelopment: boolean = false) {
    const errorObj = (typeof err === 'object' && err !== null) ? err as Record<string, unknown> : {};
    const error = err instanceof Error ? err : new Error(String(err));
    
    let status = Number(errorObj.status || errorObj.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    let message = error.message || ResponseMessage.INTERNAL_SERVER_ERROR;
    let data: Record<string, unknown> | undefined = isDevelopment ? { stack: error.stack, ...errorObj } : undefined;

    // Handle Zod Validation Errors
    if (err instanceof z.ZodError) {
      status = HttpStatus.BAD_REQUEST;
      
      const zodIssues: z.ZodIssue[] = err.issues;
      
      // Map Zod issues to a field-specific error object
      const fieldErrors: Record<string, string> = {};
      zodIssues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });

      // Use the first error message as the primary message for simple UI displays
      if (zodIssues.length > 0) {
        const firstIssue = zodIssues[0];
        const fieldName = String(firstIssue.path[firstIssue.path.length - 1]);
        message = `${fieldName}: ${firstIssue.message}`;
      } else {
        message = ResponseMessage.VALIDATION_FAILED;
      }

      data = {
        errors: fieldErrors,
        ...(isDevelopment ? { raw: zodIssues } : {})
      } as Record<string, unknown>;
    }

    // Handle AppError (Custom operational errors)
    if (err instanceof AppError) {
      status = err.statusCode;
      message = err.message;
    }

    // Handle Mongoose Validation Errors (Optional but recommended)
    if (errorObj.name === "ValidationError") {
      status = HttpStatus.BAD_REQUEST;
      message = "Database Validation Failed";
      if (errorObj.errors) {
        const dbErrors: Record<string, string> = {};
        const errorsObj = errorObj.errors as Record<string, { message: string }>;
        Object.keys(errorsObj).forEach((key) => {
          dbErrors[key] = errorsObj[key].message;
        });
        data = { errors: dbErrors };
      }
    }

    return {
      status,
      body: ApiResponse.error(message, data)
    };
  }
}
