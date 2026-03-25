import Razorpay from "razorpay";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IBillTransactionRepository } from "../../domain/repositories/IBillTransactionRepository";
import { BillTransaction } from "../../domain/entities/BillTransaction";
import { Orders } from "razorpay/dist/types/orders";

export class CreateRazorpayOrder {
  private razorpay: Razorpay;

  constructor(
    private billRepository: IBillRepository,
    private transactionRepository: IBillTransactionRepository,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZOR_KEY_ID || "",
      key_secret: process.env.RAZOR_SECRET_ID || "",
    });
  }

  async execute(billId: string, userId: string): Promise<Orders.RazorpayOrder> {
    const bill = await this.billRepository.findById(billId);

    if (!bill) {
      throw new Error("Bill not found");
    }

    if (!bill.customer || bill.customer.toString() !== userId) {
      throw new Error("Unauthorized: This bill does not belong to you");
    }

    if (bill.status === "paid") {
      throw new Error("Bill is already paid");
    }

    const options = {
      amount: Math.round(bill.totalAmount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_bill_${billId}`,
    };

    try {
      const order = await this.razorpay.orders.create(options);

      // Log pending transaction
      await this.transactionRepository.save(
        new BillTransaction(
          null,
          billId,
          userId,
          bill.totalAmount,
          "online",
          "pending",
          undefined,
          order.id,
        ),
      );

      return order;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Razorpay Order Creation Failed: ${errorMessage}`, {
        cause: error,
      });
    }
  }
}
