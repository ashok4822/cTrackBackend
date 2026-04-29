import { CreateBillRequestDto, BillResponseDto } from "../dto/BillingDto";

export interface ICreateBill {
    execute(data: CreateBillRequestDto): Promise<BillResponseDto>;
}
