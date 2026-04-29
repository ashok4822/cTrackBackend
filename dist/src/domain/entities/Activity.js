"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
class Activity {
    id;
    code;
    name;
    description;
    category;
    unitType;
    active;
    constructor(id, code, name, description, category, unitType, active) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.category = category;
        this.unitType = unitType;
        this.active = active;
    }
}
exports.Activity = Activity;
//# sourceMappingURL=Activity.js.map