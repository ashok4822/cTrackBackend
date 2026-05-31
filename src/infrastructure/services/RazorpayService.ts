import Razorpay from "razorpay";
import crypto from "crypto";
import { IPaymentService, PaymentOrder } from "../../application/services/IPaymentService";
import { IConfigService } from "../../application/services/IConfigService";
import { ExternalMapper } from "../../application/mappers/ExternalMapper";

export class RazorpayService implements IPaymentService {
  private readonly _razorpay: Razorpay;
  private readonly _keySecret: string;

  constructor(private readonly _configService: IConfigService) {
    const keyId = this._configService.get("RAZOR_KEY_ID");
    this._keySecret = this._configService.get("RAZOR_SECRET_ID");

    this._razorpay = new Razorpay({
      key_id: keyId,
      key_secret: this._keySecret,
    });
  }

  async createOrder(amount: number, receipt: string): Promise<PaymentOrder> {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: receipt,
    };
    const order = await this._razorpay.orders.create(options);
    return ExternalMapper.toPaymentOrder(order);
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const hmac = crypto.createHmac("sha256", this._keySecret);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");
    return generated_signature === signature;
  }
}
