import { z } from "zod";

export const createGateOperationSchema = z.object({
  body: z.object({
    type: z.enum(["gate-in", "gate-out"] as const),
    vehicleNumber: z.string().min(1, "Vehicle number is required"),
    driverName: z.string().min(1, "Driver name is required"),
    purpose: z.enum(["port", "factory", "transfer"] as const),
    containerNumber: z.string().optional(),
    remarks: z.string().optional(),
    approvedBy: z.string().optional(),
    driverPhone: z.string().optional(),
    vehicleType: z.string().optional(),
    size: z.enum(["20ft", "40ft"] as const).optional(),
    containerType: z.enum(["standard", "reefer", "tank", "open-top"] as const).optional(),
    shippingLine: z.string().optional(),
    weight: z.number().optional(),
    cargoWeight: z.number().optional(),
    cargoDescription: z.string().optional(),
    hazardousClassification: z.boolean().optional(),
    sealNumber: z.string().optional(),
    empty: z.boolean().optional(),
    movementType: z.enum(["import", "export", "domestic"] as const).optional(),
    customer: z.string().optional(),
    cargoCategory: z.string().optional(),
  }),
});
