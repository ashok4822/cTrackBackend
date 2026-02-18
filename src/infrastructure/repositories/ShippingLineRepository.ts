import { IShippingLineRepository } from "../../domain/repositories/IShippingLineRepository";
import { ShippingLine } from "../../domain/entities/ShippingLine";
import { ShippingLineModel } from "../models/ShippingLineModel";

export class ShippingLineRepository implements IShippingLineRepository {
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

    async save(shippingLine: ShippingLine): Promise<ShippingLine> {
        let savedDoc;
        if (shippingLine.id && shippingLine.id.match(/^[0-9a-fA-F]{24}$/)) {
            savedDoc = await ShippingLineModel.findByIdAndUpdate(shippingLine.id, {
                shipping_line_name: shippingLine.shipping_line_name,
                shipping_line_code: shippingLine.shipping_line_code,
            }, { new: true });
        } else {
            const newLine = new ShippingLineModel({
                shipping_line_name: shippingLine.shipping_line_name,
                shipping_line_code: shippingLine.shipping_line_code,
            });
            savedDoc = await newLine.save();
        }
        return new ShippingLine(savedDoc!.id, savedDoc!.shipping_line_name, savedDoc!.shipping_line_code, savedDoc!.createdAt, savedDoc!.updatedAt);
    }
}
