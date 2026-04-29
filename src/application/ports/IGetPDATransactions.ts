import { PDATransactionCollectionResponseDto } from "../dto/PDADto";

export interface IGetPDATransactions {
    execute(pdaId: string): Promise<PDATransactionCollectionResponseDto>;
}
