import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { IGetPDATransactions } from "../ports/IGetPDATransactions";
import { PDATransactionCollectionResponseDto } from "../dto/PDADto";
import { PDAMapper } from "../mappers/PDAMapper";

export class GetPDATransactions implements IGetPDATransactions {
    constructor(private _pdaRepository: IPDARepository) { }

    async execute(userId: string): Promise<PDATransactionCollectionResponseDto> {
        const pda = await this._pdaRepository.findByUserId(userId);
        if (!pda) {
            return PDAMapper.toTransactionCollectionResponseDto([]);
        }

        const transactions = await this._pdaRepository.findTransactionsByPdaId(pda.id);
        return PDAMapper.toTransactionCollectionResponseDto(transactions);
    }
}
