import { BillResponseDto, PayBillWithPDARequestDto } from "../dto/BillingDto";
import { UserContextDto } from "../dto/CommonDto";

export interface IPayBillWithPDA {
  execute(
    request: PayBillWithPDARequestDto,
    userContext?: UserContextDto
  ): Promise<BillResponseDto>;
}
