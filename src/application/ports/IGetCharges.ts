import { ChargeResponseDto } from "../dto/ChargeDto";

export interface IGetCharges {
  execute(): Promise<ChargeResponseDto[]>;
}
