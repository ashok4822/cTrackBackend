import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { ShippingLine } from "../../domain/entities/ShippingLine";

export class CreateShippingLine {
    constructor(private shippingLineRepository: IShippingLineRepository) { }

    async execute(name: string, code: string): Promise<void> {
        const shippingLine = new ShippingLine(null, name, code);
        await this.shippingLineRepository.save(shippingLine);
    }
}
