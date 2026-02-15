import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { ShippingLine } from "../../domain/entities/ShippingLine";

export class GetAllShippingLines {
    constructor(private shippingLineRepository: IShippingLineRepository) { }

    async execute(): Promise<ShippingLine[]> {
        return await this.shippingLineRepository.findAll();
    }
}
