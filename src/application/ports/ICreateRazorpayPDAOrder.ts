import { PaymentOrder } from "../services/IPaymentService";

export interface ICreateRazorpayPDAOrder {
    execute(amount: number, userId: string): Promise<PaymentOrder>;
}
