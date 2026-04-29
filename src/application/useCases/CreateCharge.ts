import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { ICreateCharge } from "../ports/ICreateCharge";
import { CreateChargeRequestDto, ChargeResponseDto } from "../dto/ChargeDto";
import { ChargeMapper } from "../mappers/ChargeMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateCharge implements ICreateCharge {
    constructor(private chargeRepository: IChargeRepository) { }

    async execute(chargeDto: CreateChargeRequestDto): Promise<ChargeResponseDto> {
        const chargeData = ChargeMapper.toEntity(chargeDto);
        
        const existing = await this.chargeRepository.findByCriteria(
            chargeData.activityId,
            chargeData.containerSize,
            chargeData.containerType
        );

        if (existing) {
            throw new AppError(`${ResponseMessage.CHARGE_ALREADY_EXISTS_ERROR} (${chargeData.containerSize}, ${chargeData.containerType})`, HttpStatus.CONFLICT);
        }

        const savedCharge = await this.chargeRepository.save(chargeData);
        return ChargeMapper.toResponseDto(savedCharge);
    }
}
