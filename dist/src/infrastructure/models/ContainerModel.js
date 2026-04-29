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
exports.ContainerModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ContainerSchema = new mongoose_1.Schema({
    containerNumber: { type: String, required: true, unique: true },
    size: { type: String, required: true, enum: ["20ft", "40ft"] },
    type: {
        type: String,
        required: true,
        enum: ["standard", "reefer", "tank", "open-top"],
    },
    movementType: { type: String, enum: ["import", "export", "domestic"] },
    status: {
        type: String,
        required: true,
        enum: [
            "pending",
            "gate-in",
            "in-yard",
            "in-transit",
            "at-port",
            "at-factory",
            "gate-out",
            "damaged",
        ],
        default: "pending",
    },
    shippingLine: { type: String, required: true },
    customer: { type: String },
    yardLocation: {
        block: { type: String },
    },
    gateInTime: { type: Date },
    gateOutTime: { type: Date },
    dwellTime: { type: Number },
    weight: { type: Number },
    cargoWeight: { type: Number },
    cargoDescription: { type: String },
    hazardousClassification: { type: Boolean, default: false },
    sealNumber: { type: String },
    damaged: { type: Boolean, default: false },
    damageDetails: { type: String },
    blacklisted: { type: Boolean, default: false },
    empty: { type: Boolean, default: true },
    cargoCategory: { type: String },
}, {
    timestamps: true,
});
exports.ContainerModel = mongoose_1.default.model("Container", ContainerSchema);
//# sourceMappingURL=ContainerModel.js.map