import { IChargeHistoryRepository } from "../../domain/repositories/IChargeHistoryRepository";
import { IGetChargeHistory } from "../ports/IGetChargeHistory";
import { ChargeHistoryCollectionResponseDto } from "../dto/ChargeDto";
import { ChargeMapper } from "../mappers/ChargeMapper";
 
export class GetChargeHistory implements IGetChargeHistory {
    constructor(private chargeHistoryRepository: IChargeHistoryRepository) { }
 
    async execute(): Promise<ChargeHistoryCollectionResponseDto> {
        const history = await this.chargeHistoryRepository.findAll();
        return ChargeMapper.toHistoryCollectionResponseDto(history);
    }
}
