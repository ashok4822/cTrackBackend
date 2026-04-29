"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentRepository = void 0;
const Equipment_1 = require("../../domain/entities/Equipment");
const EquipmentModel_1 = require("../models/EquipmentModel");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class EquipmentRepository {
    async findAll(filters) {
        const query = {};
        if (filters?.type)
            query.type = filters.type;
        if (filters?.status)
            query.status = filters.status;
        if (filters?.name) {
            query.name = { $regex: filters.name, $options: "i" };
        }
        const equipment = await EquipmentModel_1.EquipmentModel.find(query);
        return equipment.map(this.toEntity);
    }
    async findById(id) {
        const equipment = await EquipmentModel_1.EquipmentModel.findById(id);
        if (!equipment)
            return null;
        return this.toEntity(equipment);
    }
    async save(equipment) {
        const data = {
            name: equipment.name,
            type: equipment.type,
            status: equipment.status,
            operator: equipment.operator,
            lastMaintenance: equipment.lastMaintenance,
            nextMaintenance: equipment.nextMaintenance,
        };
        if (equipment.id && equipment.id.match(/^[0-9a-fA-F]{24}$/)) {
            const updated = await EquipmentModel_1.EquipmentModel.findByIdAndUpdate(equipment.id, data, { new: true });
            if (!updated) {
                throw new Error(ResponseMessage_1.ResponseMessage.EQUIPMENT_NOT_FOUND);
            }
            return this.toEntity(updated);
        }
        else {
            const newEquipment = new EquipmentModel_1.EquipmentModel(data);
            const saved = await newEquipment.save();
            return this.toEntity(saved);
        }
    }
    async delete(id) {
        await EquipmentModel_1.EquipmentModel.findByIdAndDelete(id);
    }
    toEntity(e) {
        return new Equipment_1.Equipment(e._id.toString(), e.name, e.type, e.status, e.operator, e.lastMaintenance, e.nextMaintenance, e.createdAt, e.updatedAt);
    }
    async findByStatus(status) {
        const query = {};
        if (Array.isArray(status)) {
            query.status = { $in: status };
        }
        else {
            query.status = status;
        }
        const equipment = await EquipmentModel_1.EquipmentModel.find(query);
        return equipment.map(this.toEntity);
    }
}
exports.EquipmentRepository = EquipmentRepository;
//# sourceMappingURL=EquipmentRepository.js.map