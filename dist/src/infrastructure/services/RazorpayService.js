"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
class RazorpayService {
    razorpay;
    keySecret;
    constructor(configService) {
        const keyId = configService.get("RAZOR_KEY_ID");
        this.keySecret = configService.get("RAZOR_SECRET_ID");
        this.razorpay = new razorpay_1.default({
            key_id: keyId,
            key_secret: this.keySecret,
        });
    }
    async createOrder(amount, receipt) {
        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency: "INR",
            receipt: receipt,
        };
        const order = await this.razorpay.orders.create(options);
        return {
            id: order.id,
            amount: Number(order.amount),
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
        };
    }
    verifySignature(orderId, paymentId, signature) {
        const hmac = crypto_1.default.createHmac("sha256", this.keySecret);
        hmac.update(orderId + "|" + paymentId);
        const generated_signature = hmac.digest("hex");
        return generated_signature === signature;
    }
}
exports.RazorpayService = RazorpayService;
//# sourceMappingURL=RazorpayService.js.map