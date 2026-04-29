"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEquipment = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EquipmentMapper_1 = require("../mappers/EquipmentMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class UpdateEquipment {
    equipmentRepository;
    userRepository;
    eventBus;
    notificationService;
    constructor(equipmentRepository, userRepository, eventBus, notificationService) {
        this.equipmentRepository = equipmentRepository;
        this.userRepository = userRepository;
        this.eventBus = eventBus;
        this.notificationService = notificationService;
    }
    async execute(id, data, performedBy) {
        const existingEquipment = await this.equipmentRepository.findById(id);
        if (!existingEquipment) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.EQUIPMENT_NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND);
        }
        const isStatusChanged = data.status && data.status !== existingEquipment.status;
        const updatedEquipment = EquipmentMapper_1.EquipmentMapper.applyUpdate(existingEquipment, data);
        const savedEquipment = await this.equipmentRepository.save(updatedEquipment);
        // Record History (Event-driven)
        const historyDetails = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
        this.eventBus.emit(IEventBus_1.DomainEvents.EQUIPMENT_HISTORY_CREATED, {
            equipmentId: id,
            action: ResponseMessage_1.ResponseMessage.ACTION_UPDATED,
            details: historyDetails || ResponseMessage_1.ResponseMessage.DETAILS_NO_CHANGES,
            performedBy: performedBy || "System"
        });
        // Notify Admins if status changed
        if (isStatusChanged) {
            try {
                const admins = await this.userRepository.findByRole("admin");
                for (const admin of admins) {
                    if (admin.id) {
                        await this.notificationService.send(admin.id, {
                            type: "info",
                            title: ResponseMessage_1.ResponseMessage.EQUIPMENT_STATUS_UPDATED_TITLE,
                            message: `Equipment "${savedEquipment.name}" status has been updated to ${savedEquipment.status} by ${performedBy || "System"}.`,
                            link: "/admin/vehicles",
                        });
                    }
                }
            }
            catch (error) {
                console.error("Failed to send admin notifications for equipment update:", error);
            }
        }
        return EquipmentMapper_1.EquipmentMapper.toResponseDto(savedEquipment);
    }
}
exports.UpdateEquipment = UpdateEquipment;
//# sourceMappingURL=UpdateEquipment.js.map