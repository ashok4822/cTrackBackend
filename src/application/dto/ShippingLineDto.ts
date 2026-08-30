export class CreateShippingLineRequestDto {
  name!: string;
  code?: string;
}

export class UpdateShippingLineRequestDto {
  name?: string;
  code?: string;
}

export class ShippingLineResponseDto {
  id!: string;
  name!: string;
  code?: string;
}

export class ShippingLineCollectionResponseDto {
  items!: ShippingLineResponseDto[];
  total!: number;
}
