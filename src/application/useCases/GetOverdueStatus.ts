import { IGetOverdueStatus } from "../ports/IGetOverdueStatus";
import { IBillRepository } from "../../domain/repositories/IBillRepository";

export class GetOverdueStatus implements IGetOverdueStatus {
  constructor(private readonly _billRepository: IBillRepository) {}

  async execute(customerId: string): Promise<boolean> {
    const bills = await this._billRepository.findAll(customerId);
    return bills.some((bill) => bill.status === "overdue");
  }
}
