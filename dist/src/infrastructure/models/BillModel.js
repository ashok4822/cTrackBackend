"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LineItemSchema = new mongoose_1.Schema({
    activityCode: { type: String, required: true },
    activityName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
});
const BillSchema = new mongoose_1.Schema({
    billNumber: { type: String, required: true, unique: true },
    containerNumber: { type: String, required: true },
    containerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Container" },
    shippingLine: { type: String, required: true },
    customer: { type: String },
    lineItems: [LineItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "paid", "overdue"],
        default: "pending",
    },
    dueDate: { type: Date, required: true },
    remarks: { type: String },
    paidAt: { type: Date },
    paymentMethod: { type: String, enum: ["pda", "online"] },
}, {
    timestamps: true,
});
exports.BillModel = mongoose_1.default.model("Bill", BillSchema);
//# sourceMappingURL=BillModel.js.map