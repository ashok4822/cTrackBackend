import { DepositFundsRequestDto, PDATransactionResponseDto } from "../dto/PDADto";

export interface IDepositFunds {
    execute(data: DepositFundsRequestDto): Promise<PDATransactionResponseDto>;
}
