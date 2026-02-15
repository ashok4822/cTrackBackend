import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { ShippingLine } from "../../domain/entities/ShippingLine";
import { ShippingLineModel } from "../models/ShippingLineModel";

export class MongoShippingLineRepository implements IShippingLineRepository {
    async findAll(): Promise<ShippingLine[]> {
        const lines = await ShippingLineModel.find();
        return lines.map(
            (l) => new ShippingLine(l.id, l.shipping_line_name, l.shipping_line_code, l.createdAt, l.updatedAt)
        );
    }

    async findById(id: string): Promise<ShippingLine | null> {
        const line = await ShippingLineModel.findById(id);
        if (!line) return null;
        return new ShippingLine(line.id, line.shipping_line_name, line.shipping_line_code, line.createdAt, line.updatedAt);
    }

    async save(shippingLine: ShippingLine): Promise<void> {
        if (shippingLine.id && shippingLine.id.match(/^[0-9a-fA-F]{24}$/)) {
            await ShippingLineModel.findByIdAndUpdate(shippingLine.id, {
                shipping_line_name: shippingLine.shipping_line_name,
                shipping_line_code: shippingLine.shipping_line_code,
            });
        } else {
            const newLine = new ShippingLineModel({
                shipping_line_name: shippingLine.shipping_line_name,
                shipping_line_code: shippingLine.shipping_line_code,
            });
            await newLine.save();
        }
    }
}
