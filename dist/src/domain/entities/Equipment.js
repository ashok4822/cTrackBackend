"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipment = void 0;
class Equipment {
    id;
    name;
    type;
    status;
    operator;
    lastMaintenance;
    nextMaintenance;
    createdAt;
    updatedAt;
    constructor(id, name, type, status, operator, lastMaintenance, nextMaintenance, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
        this.operator = operator;
        this.lastMaintenance = lastMaintenance;
        this.nextMaintenance = nextMaintenance;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Equipment = Equipment;
//# sourceMappingURL=Equipment.js.map