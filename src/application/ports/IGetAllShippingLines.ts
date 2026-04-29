import { ShippingLineCollectionResponseDto } from "../dto/ShippingLineDto";

export interface IGetAllShippingLines {
    execute(): Promise<ShippingLineCollectionResponseDto>;
}
