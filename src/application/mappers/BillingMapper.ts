import { Bill } from "../../domain/entities/Bill";
import { BillTransaction } from "../../domain/entities/BillTransaction";
import { 
  CreateBillRequestDto, 
  BillResponseDto, 
  BillCollectionResponseDto,
  BillTransactionResponseDto,
  BillTransactionCollectionResponseDto
} from "../dto/BillingDto";

export class BillingMapper {
  static toEntity(dto: CreateBillRequestDto): Bill {
    const billNumber = `BL-MISC-${Date.now().toString().slice(-6)}`;
    return new Bill(
      null,
      billNumber,
      dto.containerNumber,
      dto.shippingLine || "N/A",
      dto.containerId,
      dto.customer || null,
      dto.customerName,
      dto.lineItems.map(item => ({
        ...item,
        amount: item.quantity * item.unitPrice
      })),
      dto.totalAmount,
      "pending",
      dto.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      dto.remarks,
      undefined, // paidAt
      undefined, // paymentMethod
      new Date(),
      new Date()
    );
  }

  /** Create a new BillTransaction entity for payment recording */
  static toTransactionEntity(
    billId: string,
    userId: string,
    amount: number,
    method: "pda" | "online",
    status: "pending" | "success" | "failed",
    transactionId?: string,
    orderId?: string
  ): BillTransaction {
    return new BillTransaction(null, billId, userId, amount, method, status, transactionId, orderId);
  }


  static toResponseDto(bill: Bill): BillResponseDto {
    return {
      id: bill.id,
      billNumber: bill.billNumber,
      containerNumber: bill.containerNumber,
      shippingLine: bill.shippingLine,
      containerId: bill.containerId,
      customer: bill.customer,
      customerName: bill.customerName,
      lineItems: bill.lineItems,
      totalAmount: bill.totalAmount,
      status: bill.status,
      dueDate: bill.dueDate,
      remarks: bill.remarks,
      paidAt: bill.paidAt,
      paymentMethod: bill.paymentMethod,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
    };
  }

  static toCollectionResponseDto(bills: Bill[]): BillCollectionResponseDto {
    return {
      items: bills.map(b => this.toResponseDto(b)),
      total: bills.length,
    };
  }

  static toTransactionResponseDto(tx: BillTransaction): BillTransactionResponseDto {
    return {
      id: tx.id,
      billId: tx.billId,
      userId: tx.userId,
      amount: tx.amount,
      method: tx.method,
      status: tx.status,
      transactionId: tx.transactionId || "",
      orderId: tx.orderId,
      errorDetails: tx.errorDetails,
      timestamp: tx.timestamp || tx.createdAt || new Date(),
    };
  }

  static toTransactionCollectionResponseDto(transactions: BillTransaction[]): BillTransactionCollectionResponseDto {
    return {
      items: transactions.map(tx => this.toTransactionResponseDto(tx)),
      total: transactions.length,
    };
  }
}
