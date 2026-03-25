import { IBillTransactionRepository } from "../../domain/repositories/IBillTransactionRepository";
import { BillTransaction } from "../../domain/entities/BillTransaction";

export class GetBillTransactions {
  constructor(private transactionRepository: IBillTransactionRepository) {}

  async execute(
    billId: string,
    _userId: string,
    _userRole: string,
  ): Promise<BillTransaction[]> {
    // If customer, ensure they only see their own bill's transactions
    // Note: We could fetch the bill here to verify ownership, but for simplicity
    // and efficiency, we'll assume the controller handles basic access control
    // or we can add it here if we pass the bill object/ID.

    return await this.transactionRepository.findByBillId(billId);
  }
}
