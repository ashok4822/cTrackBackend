import { BillResponseDto } from "../dto/BillingDto";

export interface IGetBillById {
    execute(id: string): Promise<BillResponseDto | null>;
}
