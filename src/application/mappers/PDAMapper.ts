import { PDA, PDATransaction } from "../../domain/entities/PDA";
import { 
  PDABalanceResponseDto, 
  PDATransactionResponseDto, 
  PDATransactionCollectionResponseDto,
  PDAResponseDto
} from "../dto/PDADto";

export class PDAMapper {
  static toBalanceResponseDto(balance: number, lowBalanceThreshold?: number): PDABalanceResponseDto {
    return {
      balance,
      lowBalanceThreshold,
    };
  }

  static toTransactionResponseDto(tx: PDATransaction): PDATransactionResponseDto {
    return {
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      balanceAfter: tx.balanceAfter,
      timestamp: tx.timestamp,
    };
  }

  static toTransactionCollectionResponseDto(transactions: PDATransaction[]): PDATransactionCollectionResponseDto {
    return {
      items: transactions.map(tx => this.toTransactionResponseDto(tx)),
      total: transactions.length,
    };
  }

  static toPDAResponseDto(pda: PDA, transactions?: PDATransaction[], lowBalanceThreshold?: number): PDAResponseDto {
    return {
      id: pda.id,
      userId: pda.userId,
      customer: pda.customer,
      balance: pda.balance,
      lastUpdated: pda.lastUpdated,
      transactions: transactions?.map(tx => this.toTransactionResponseDto(tx)),
      lowBalanceThreshold,
    };
  }
}
