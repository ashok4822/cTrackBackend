"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingLineRepository = void 0;
const ShippingLine_1 = require("../../domain/entities/ShippingLine");
const ShippingLineModel_1 = require("../models/ShippingLineModel");
class ShippingLineRepository {
    async findAll() {
        const lines = await ShippingLineModel_1.ShippingLineModel.find();
        return lines.map((l) => new ShippingLine_1.ShippingLine(l.id, l.shipping_line_name, l.shipping_line_code, l.createdAt, l.updatedAt));
    }
    async findById(id) {
        const line = await ShippingLineModel_1.ShippingLineModel.findById(id);
        if (!line)
            return null;
        return new ShippingLine_1.ShippingLine(line.id, line.shipping_line_name, line.shipping_line_code, line.createdAt, line.updatedAt);
    }
    async save(shippingLine) {
        let savedDoc;
        if (shippingLine.id && shippingLine.id.match(/^[0-9a-fA-F]{24}$/)) {
            savedDoc = await ShippingLineModel_1.ShippingLineModel.findByIdAndUpdate(shippingLine.id, {
                shipping_line_name: shippingLine.shipping_line_name,
                shipping_line_code: shippingLine.shipping_line_code,
            }, { new: true });
        }
        else {
            const newLine = new ShippingLineModel_1.ShippingLineModel({
                shipping_line_name: shippingLine.shipping_line_name,
                shipping_line_code: shippingLine.shipping_line_code,
            });
            savedDoc = await newLine.save();
        }
        return new ShippingLine_1.ShippingLine(savedDoc.id, savedDoc.shipping_line_name, savedDoc.shipping_line_code, savedDoc.createdAt, savedDoc.updatedAt);
    }
}
exports.ShippingLineRepository = ShippingLineRepository;
//# sourceMappingURL=ShippingLineRepository.js.map