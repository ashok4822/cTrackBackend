import { BillResponseDto } from "../dto/BillingDto";
import { UserContextDto } from "../dto/CommonDto";

export interface IVerifyRazorpayPayment {
    execute(
        billId: string,
        userId: string,
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        userContext?: UserContextDto
    ): Promise<BillResponseDto>;
}
