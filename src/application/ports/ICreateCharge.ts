import { CreateChargeRequestDto, ChargeResponseDto } from "../dto/ChargeDto";

export interface ICreateCharge {
  execute(chargeData: CreateChargeRequestDto): Promise<ChargeResponseDto>;
}
