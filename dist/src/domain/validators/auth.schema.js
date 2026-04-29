"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = exports.googleLoginSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    }),
});
exports.googleLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, "Google token is required"),
    }),
});
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email("Invalid email address"),
        name: zod_1.z.string().min(1, "Name is required"),
        phone: zod_1.z.string().optional(),
        companyName: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=auth.schema.js.map