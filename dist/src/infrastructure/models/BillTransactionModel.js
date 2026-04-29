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
exports.BillTransactionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BillTransactionSchema = new mongoose_1.Schema({
    billId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bill", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["pda", "online"], required: true },
    status: { type: String, enum: ["pending", "success", "failed"], required: true, default: "pending" },
    transactionId: { type: String },
    orderId: { type: String },
    errorDetails: { type: String },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
// Index for faster lookups
BillTransactionSchema.index({ billId: 1, timestamp: -1 });
BillTransactionSchema.index({ orderId: 1 });
exports.BillTransactionModel = mongoose_1.default.model("BillTransaction", BillTransactionSchema);
//# sourceMappingURL=BillTransactionModel.js.map