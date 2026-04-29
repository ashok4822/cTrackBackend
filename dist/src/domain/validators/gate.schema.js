"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGateOperationSchema = void 0;
const zod_1 = require("zod");
exports.createGateOperationSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(["gate-in", "gate-out"]),
        vehicleNumber: zod_1.z.string().min(1, "Vehicle number is required"),
        driverName: zod_1.z.string().min(1, "Driver name is required"),
        purpose: zod_1.z.enum(["port", "factory", "transfer"]),
        containerNumber: zod_1.z.string().optional(),
        remarks: zod_1.z.string().optional(),
        approvedBy: zod_1.z.string().optional(),
        driverPhone: zod_1.z.string().optional(),
        vehicleType: zod_1.z.string().optional(),
        size: zod_1.z.enum(["20ft", "40ft"]).optional(),
        containerType: zod_1.z.enum(["standard", "reefer", "tank", "open-top"]).optional(),
        shippingLine: zod_1.z.string().optional(),
        weight: zod_1.z.number().optional(),
        cargoWeight: zod_1.z.number().optional(),
        cargoDescription: zod_1.z.string().optional(),
        hazardousClassification: zod_1.z.boolean().optional(),
        sealNumber: zod_1.z.string().optional(),
        empty: zod_1.z.boolean().optional(),
        movementType: zod_1.z.enum(["import", "export", "domestic"]).optional(),
        customer: zod_1.z.string().optional(),
        cargoCategory: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=gate.schema.js.map