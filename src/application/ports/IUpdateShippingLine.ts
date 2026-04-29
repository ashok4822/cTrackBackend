import { UpdateShippingLineRequestDto, ShippingLineResponseDto } from "../dto/ShippingLineDto";
import { UserContextDto } from "../dto/CommonDto";

export interface IUpdateShippingLine {
    execute(
        id: string, 
        data: UpdateShippingLineRequestDto, 
        userContext: UserContextDto
    ): Promise<ShippingLineResponseDto>;
}
