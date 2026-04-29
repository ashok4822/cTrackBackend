"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingLine = void 0;
class ShippingLine {
    id;
    shipping_line_name;
    shipping_line_code;
    createdAt;
    updatedAt;
    constructor(id, shipping_line_name, shipping_line_code, createdAt, updatedAt) {
        this.id = id;
        this.shipping_line_name = shipping_line_name;
        this.shipping_line_code = shipping_line_code;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.ShippingLine = ShippingLine;
//# sourceMappingURL=ShippingLine.js.map