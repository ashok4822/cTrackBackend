export class CreateCargoCategoryRequestDto {
  name!: string;
  description?: string;
  chargePerTon?: number;
}

export class UpdateCargoCategoryRequestDto {
  name?: string;
  description?: string;
  chargePerTon?: number;
}

export class CargoCategoryResponseDto {
  id!: string | null;
  name!: string;
  description?: string;
  chargePerTon?: number;
  active!: boolean;
}

export class CargoCategoryCollectionResponseDto {
  items!: CargoCategoryResponseDto[];
  total!: number;
}
