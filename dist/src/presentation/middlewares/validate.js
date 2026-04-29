"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
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
    }
    catch (error) {
        if (error.errors) {
            const message = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
            return next(new AppError_1.AppError(message, HttpStatus_1.HttpStatus.BAD_REQUEST));
        }
        next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map