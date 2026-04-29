import { PDATransactionResponseDto } from "../dto/PDADto";

export interface IVerifyRazorpayPDAPayment {
    execute(
        userId: string,
        amount: number,
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string
    ): Promise<PDATransactionResponseDto>;
}
