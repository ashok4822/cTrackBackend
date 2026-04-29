export interface CreateCargoCategoryRequestDto {
  name: string;
  description?: string;
  chargePerTon?: number;
}

export interface UpdateCargoCategoryRequestDto {
  name?: string;
  description?: string;
  chargePerTon?: number;
}

export interface CargoCategoryResponseDto {
  id: string | null;
  name: string;
  description?: string;
  chargePerTon?: number;
  active: boolean;
}

export interface CargoCategoryCollectionResponseDto {
  items: CargoCategoryResponseDto[];
  total: number;
}
