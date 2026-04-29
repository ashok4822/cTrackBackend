export interface BillLineItemDto {
  activityCode: string;
  activityName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CreateBillRequestDto {
  containerNumber: string;
  shippingLine: string;
  containerId?: string;
  customer?: string;
  customerName?: string;
  lineItems: BillLineItemDto[];
  totalAmount: number;
  remarks?: string;
  dueDate?: Date;
}

export interface BillResponseDto {
  id: string | null;
  billNumber: string;
  containerNumber: string;
  shippingLine: string;
  containerId?: string;
  customer: string | null;
  customerName?: string;
  lineItems: BillLineItemDto[];
  totalAmount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: Date;
  remarks?: string;
  paidAt?: Date;
  paymentMethod?: "pda" | "online";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BillCollectionResponseDto {
  items: BillResponseDto[];
  total: number;
}

export interface BillTransactionResponseDto {
  id: string | null;
  billId: string;
  userId: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  orderId?: string;
  errorDetails?: string;
  timestamp: Date;
}

export interface BillTransactionCollectionResponseDto {
  items: BillTransactionResponseDto[];
  total: number;
}

export interface GetBillsRequestDto {
  customerId?: string;
  status?: string;
}

export interface GetBillTransactionsRequestDto {
  billId?: string;
  customerId?: string;
}

export interface PayBillWithPDARequestDto {
  billId: string;
  userId: string;
}
