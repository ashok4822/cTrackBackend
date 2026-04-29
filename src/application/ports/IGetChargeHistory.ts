import { ChargeHistoryCollectionResponseDto } from "../dto/ChargeDto";
 
export interface IGetChargeHistory {
  execute(): Promise<ChargeHistoryCollectionResponseDto>;
}
