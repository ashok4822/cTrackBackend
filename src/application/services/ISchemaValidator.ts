export interface ISchemaValidator {
    /**
     * Validates data against a predefined schema.
     * The schema parameter is typed as `unknown` to remain library-agnostic;
     * concrete implementations cast it to their specific schema type internally.
     * @param schema The schema object (e.g. a Zod schema, Joi schema, etc.)
     * @param data The data to validate
     * @returns The validated, parsed output
     */
    validate<T>(schema: unknown, data: unknown): T;
}
