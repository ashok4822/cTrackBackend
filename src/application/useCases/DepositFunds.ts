import { IDepositFunds } from "../ports/IDepositFunds";
import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { DepositFundsRequestDto, PDATransactionResponseDto } from "../dto/PDADto";
import { PDAMapper } from "../mappers/PDAMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class DepositFunds implements IDepositFunds {
    constructor(private readonly _pdaRepository: IPDARepository) { }

    async execute(data: DepositFundsRequestDto): Promise<PDATransactionResponseDto> {
        const { userId, amount, description } = data;
        const pda = await this._pdaRepository.findByUserId(userId!);
        if (!pda) throw new AppError(ResponseMessage.PDA_NOT_FOUND, HttpStatus.NOT_FOUND);

        const newBalance = pda.balance + amount;

        const transaction = await this._pdaRepository.createTransaction({
            pdaId: pda.id,
            type: "credit",
            amount,
            description,
            balanceAfter: newBalance,
            timestamp: new Date()
        });

        await this._pdaRepository.updateBalance(pda.id, newBalance);

        return PDAMapper.toTransactionResponseDto(transaction);
    }
}

