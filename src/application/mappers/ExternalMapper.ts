import { PaymentOrder } from "../../application/services/IPaymentService";
import { GoogleUserDetails } from "../../application/services/IAuthService";

export class ExternalMapper {
  /**
   * Maps Razorpay order response to internal PaymentOrder DTO.
   */
  static toPaymentOrder(razorpayOrder: { id: string; amount: number | string; currency: string; receipt?: string; status: string }): PaymentOrder {
    return {
      id: razorpayOrder.id,
      amount: Number(razorpayOrder.amount),
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt as string,
      status: razorpayOrder.status,
    };
  }

  /**
   * Maps Google OAuth payload to internal GoogleUserDetails DTO.
   */
  static toGoogleUserDetails(payload: { email: string; name: string; sub: string; picture: string }): GoogleUserDetails {
    return {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      profileImage: payload.picture,
    };
  }
}
