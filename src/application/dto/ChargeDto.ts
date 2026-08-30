export class ChargeResponseDto {
  id!: string | null;
  activityId!: string;
  activityName!: string;
  containerSize!: "20ft" | "40ft" | "all";
  containerType!: "standard" | "reefer" | "tank" | "all";
  rate!: number;
  currency!: string;
  effectiveFrom!: Date;
  effectiveTo?: Date;
  active!: boolean;
  cargoCategoryId?: string;
  cargoCategoryName?: string;
}

export class ChargeCollectionResponseDto {
  items!: ChargeResponseDto[];
  total!: number;
}

export class CreateChargeRequestDto {
  activityId!: string;
  containerSize!: "20ft" | "40ft" | "all";
  containerType!: "standard" | "reefer" | "tank" | "all";
  rate!: number;
  currency!: string;
  effectiveFrom?: Date;
  cargoCategoryId?: string;
}

export class UpdateChargeRateRequestDto {
  rate!: number;
  effectiveFrom?: Date;
  active?: boolean;
}

export class ChargeHistoryResponseDto {
  id!: string | null;
  chargeId!: string;
  activityName!: string;
  containerSize!: string;
  containerType!: string;
  oldRate!: number;
  newRate!: number;
  currency!: string;
  changedAt!: Date;
}

export class ChargeHistoryCollectionResponseDto {
  items!: ChargeHistoryResponseDto[];
  total!: number;
}
