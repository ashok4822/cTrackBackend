import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { ShippingLine } from "../../domain/entities/ShippingLine";

interface UpdateShippingLineData {
    name?: string;
    code?: string;
}

export class UpdateShippingLine {
    constructor(private shippingLineRepository: IShippingLineRepository) { }

    async execute(id: string, data: UpdateShippingLineData): Promise<void> {
        const shippingLine = await this.shippingLineRepository.findById(id);
        if (!shippingLine) {
            throw new Error("Shipping Line not found");
        }

        const updatedShippingLine = new ShippingLine(
            shippingLine.id,
            data.name !== undefined ? data.name : shippingLine.shipping_line_name,
            data.code !== undefined ? data.code : shippingLine.shipping_line_code
        );

        await this.shippingLineRepository.save(updatedShippingLine);
    }
}
