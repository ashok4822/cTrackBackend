import Razorpay from "razorpay";
import crypto from "crypto";
import { IPaymentService, PaymentOrder } from "../../application/services/IPaymentService";
import { IConfigService } from "../../application/services/IConfigService";

export class RazorpayService implements IPaymentService {
  private razorpay: Razorpay;
  private keySecret: string;

  constructor(configService: IConfigService) {
    const keyId = configService.get("RAZOR_KEY_ID");
    this.keySecret = configService.get("RAZOR_SECRET_ID");

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: this.keySecret,
    });
  }

  async createOrder(amount: number, receipt: string): Promise<PaymentOrder> {
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
      receipt: order.receipt as string,
      status: order.status,
    };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const hmac = crypto.createHmac("sha256", this.keySecret);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");
    return generated_signature === signature;
  }
}
