"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEquipment = void 0;
class DeleteEquipment {
    equipmentRepository;
    constructor(equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }
    async execute(id) {
        await this.equipmentRepository.delete(id);
    }
}
exports.DeleteEquipment = DeleteEquipment;
//# sourceMappingURL=DeleteEquipment.js.map