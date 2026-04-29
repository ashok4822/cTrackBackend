export interface DepositFundsRequestDto {
  userId?: string;
  customerName?: string;
  amount: number;
  description: string;
}

export interface PDABalanceResponseDto {
  balance: number;
  lowBalanceThreshold?: number;
}

export interface PDATransactionResponseDto {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  balanceAfter: number;
  timestamp: Date;
}

export interface PDAResponseDto {
  id: string;
  userId: string;
  customer: string;
  balance: number;
  lastUpdated: Date;
  transactions?: PDATransactionResponseDto[];
  lowBalanceThreshold?: number;
}

export interface PDATransactionCollectionResponseDto {
  items: PDATransactionResponseDto[];
  total: number;
}
