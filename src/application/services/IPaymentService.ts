export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface IPaymentService {
  createOrder(amount: number, receipt: string): Promise<PaymentOrder>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}
