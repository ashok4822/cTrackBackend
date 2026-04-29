import { CreateShippingLineRequestDto, ShippingLineResponseDto } from "../dto/ShippingLineDto";
import { UserContextDto } from "../dto/CommonDto";

export interface ICreateShippingLine {
    execute(data: CreateShippingLineRequestDto, userContext: UserContextDto): Promise<ShippingLineResponseDto>;
}
