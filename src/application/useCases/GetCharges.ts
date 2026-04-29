import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IGetCharges } from "../ports/IGetCharges";
import { ChargeResponseDto } from "../dto/ChargeDto";
import { ChargeMapper } from "../mappers/ChargeMapper";

export class GetCharges implements IGetCharges {
    constructor(private chargeRepository: IChargeRepository) { }

    async execute(): Promise<ChargeResponseDto[]> {
        const charges = await this.chargeRepository.findAll();
        return charges.map(c => ChargeMapper.toResponseDto(c));
    }
}
