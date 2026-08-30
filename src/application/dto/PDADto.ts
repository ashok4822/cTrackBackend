export class DepositFundsRequestDto {
  userId?: string;
  customerName?: string;
  amount!: number;
  description!: string;
}

export class PDABalanceResponseDto {
  balance!: number;
  lowBalanceThreshold?: number;
}

export class PDATransactionResponseDto {
  id!: string;
  type!: "credit" | "debit";
  amount!: number;
  description!: string;
  balanceAfter!: number;
  timestamp!: Date;
}

export class PDAResponseDto {
  id!: string;
  userId!: string;
  customer!: string;
  balance!: number;
  lastUpdated!: Date;
  transactions?: PDATransactionResponseDto[];
  lowBalanceThreshold?: number;
}

export class PDATransactionCollectionResponseDto {
  items!: PDATransactionResponseDto[];
  total!: number;
}
