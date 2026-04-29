"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEquipment = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EquipmentMapper_1 = require("../mappers/EquipmentMapper");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateEquipment {
    equipmentRepository;
    eventBus;
    constructor(equipmentRepository, eventBus) {
        this.equipmentRepository = equipmentRepository;
        this.eventBus = eventBus;
    }
    async execute(data, performedBy) {
        const equipment = EquipmentMapper_1.EquipmentMapper.toEntity(data);
        const savedEquipment = await this.equipmentRepository.save(equipment);
        // Record History (Event-driven)
        if (savedEquipment.id) {
            this.eventBus.emit(IEventBus_1.DomainEvents.EQUIPMENT_HISTORY_CREATED, {
                equipmentId: savedEquipment.id,
                action: ResponseMessage_1.ResponseMessage.ACTION_CREATED,
                details: `${ResponseMessage_1.ResponseMessage.DETAILS_INITIALIZED}: ${data.name}`,
                performedBy: performedBy || "System"
            });
        }
        return EquipmentMapper_1.EquipmentMapper.toResponseDto(savedEquipment);
    }
}
exports.CreateEquipment = CreateEquipment;
//# sourceMappingURL=CreateEquipment.js.map