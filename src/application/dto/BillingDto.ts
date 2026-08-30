export class BillLineItemDto {
  activityCode!: string;
  activityName!: string;
  quantity!: number;
  unitPrice!: number;
  amount!: number;
}

export class CreateBillRequestDto {
  containerNumber!: string;
  shippingLine!: string;
  containerId?: string;
  customer?: string;
  customerName?: string;
  lineItems!: BillLineItemDto[];
  totalAmount!: number;
  remarks?: string;
  dueDate?: Date;
}

export class BillResponseDto {
  id!: string | null;
  billNumber!: string;
  containerNumber!: string;
  shippingLine!: string;
  containerId?: string;
  customer!: string | null;
  customerName?: string;
  lineItems!: BillLineItemDto[];
  totalAmount!: number;
  status!: "pending" | "paid" | "overdue";
  dueDate!: Date;
  remarks?: string;
  paidAt?: Date;
  paymentMethod?: "pda" | "online";
  createdAt?: Date;
  updatedAt?: Date;
}

export class BillCollectionResponseDto {
  items!: BillResponseDto[];
  total!: number;
}

export class BillTransactionResponseDto {
  id!: string | null;
  billId!: string;
  userId!: string;
  amount!: number;
  method!: string;
  status!: string;
  transactionId!: string;
  orderId?: string;
  errorDetails?: string;
  timestamp!: Date;
}

export class BillTransactionCollectionResponseDto {
  items!: BillTransactionResponseDto[];
  total!: number;
}

export class GetBillsRequestDto {
  customerId?: string;
  status?: string;
}

export class GetBillTransactionsRequestDto {
  billId?: string;
  customerId?: string;
}

export class PayBillWithPDARequestDto {
  billId!: string;
  userId!: string;
}
