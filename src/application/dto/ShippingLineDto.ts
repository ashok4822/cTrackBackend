export interface CreateShippingLineRequestDto {
  name: string;
  code?: string;
}

export interface UpdateShippingLineRequestDto {
  name?: string;
  code?: string;
}

export interface ShippingLineResponseDto {
  id: string;
  name: string;
  code?: string;
}

export interface ShippingLineCollectionResponseDto {
  items: ShippingLineResponseDto[];
  total: number;
}
