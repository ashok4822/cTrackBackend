import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IBillTransactionRepository } from "../../domain/repositories/IBillTransactionRepository";
import { ICreateRazorpayOrder } from "../ports/ICreateRazorpayOrder";
import { IPaymentService, PaymentOrder } from "../services/IPaymentService";
import { BillingMapper } from "../mappers/BillingMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateRazorpayOrder implements ICreateRazorpayOrder {
  constructor(
    private readonly _billRepository: IBillRepository,
    private readonly _transactionRepository: IBillTransactionRepository,
    private readonly _paymentService: IPaymentService,
  ) { }

  async execute(billId: string, userId: string): Promise<PaymentOrder> {
    const bill = await this._billRepository.findById(billId);

    if (!bill) {
      throw new AppError(ResponseMessage.BILL_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!bill.customer || bill.customer.toString() !== userId) {
      throw new AppError(ResponseMessage.BILL_OWNERSHIP_ERROR, HttpStatus.FORBIDDEN);
    }

    if (bill.status === "paid") {
      throw new AppError(ResponseMessage.BILL_ALREADY_PAID, HttpStatus.CONFLICT);
    }

    const receipt = `receipt_bill_${billId}`;

    try {
      const order = await this._paymentService.createOrder(bill.totalAmount, receipt);

      // Log pending transaction
      await this._transactionRepository.save(
        BillingMapper.toTransactionEntity(billId, userId, bill.totalAmount, "online", "pending", undefined, order.id)
      );

      return order;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new AppError(`${ResponseMessage.RAZORPAY_ORDER_FAILED}: ${errorMessage}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

