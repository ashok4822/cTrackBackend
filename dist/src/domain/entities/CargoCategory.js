"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoCategory = void 0;
class CargoCategory {
    id;
    name;
    description;
    active;
    chargePerTon;
    constructor(id, name, description, active = true, chargePerTon = 0) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.active = active;
        this.chargePerTon = chargePerTon;
    }
}
exports.CargoCategory = CargoCategory;
//# sourceMappingURL=CargoCategory.js.map