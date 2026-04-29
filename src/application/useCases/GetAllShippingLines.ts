import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { IGetAllShippingLines } from "../ports/IGetAllShippingLines";
import { ShippingLineCollectionResponseDto } from "../dto/ShippingLineDto";
import { ShippingLineMapper } from "../mappers/ShippingLineMapper";

export class GetAllShippingLines implements IGetAllShippingLines {
    constructor(private shippingLineRepository: IShippingLineRepository) { }

    async execute(): Promise<ShippingLineCollectionResponseDto> {
        const shippingLines = await this.shippingLineRepository.findAll();
        return ShippingLineMapper.toCollectionResponseDto(shippingLines);
    }
}
