import { PaymentOrder } from "../services/IPaymentService";

export interface ICreateRazorpayOrder {
  execute(billId: string, userId: string): Promise<PaymentOrder>;
}
