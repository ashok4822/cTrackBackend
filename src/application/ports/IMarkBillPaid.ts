import { BillResponseDto } from "../dto/BillingDto";

export interface IMarkBillPaid {
  execute(id: string): Promise<BillResponseDto | null>;
}
