"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllEquipment = void 0;
const EquipmentMapper_1 = require("../mappers/EquipmentMapper");
class GetAllEquipment {
    equipmentRepository;
    constructor(equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }
    async execute(filters) {
        const equipmentList = await this.equipmentRepository.findAll(filters);
        return EquipmentMapper_1.EquipmentMapper.toCollectionResponseDto(equipmentList);
    }
}
exports.GetAllEquipment = GetAllEquipment;
//# sourceMappingURL=GetAllEquipment.js.map