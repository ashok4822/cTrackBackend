import { z } from "zod";
import { ISchemaValidator } from "../../application/services/ISchemaValidator";

export class ZodSchemaValidator implements ISchemaValidator {
    validate<T>(schema: unknown, data: unknown): T {
        return (schema as z.ZodTypeAny).parse(data) as T;
    }
}
