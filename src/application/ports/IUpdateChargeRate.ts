import { ChargeResponseDto, UpdateChargeRateRequestDto } from "../dto/ChargeDto";

export interface IUpdateChargeRate {
  execute(id: string, rateData: UpdateChargeRateRequestDto): Promise<ChargeResponseDto | null>;
}
