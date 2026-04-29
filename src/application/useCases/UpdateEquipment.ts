import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUpdateEquipment } from "../ports/IUpdateEquipment";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { INotificationService } from "../services/INotificationService";
import { UpdateEquipmentRequestDto, EquipmentResponseDto } from "../dto/EquipmentDto";
import { EquipmentMapper } from "../mappers/EquipmentMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class UpdateEquipment implements IUpdateEquipment {
    constructor(
        private equipmentRepository: IEquipmentRepository,
        private userRepository: IUserRepository,
        private eventBus: IEventBus,
        private notificationService: INotificationService
    ) { }

    async execute(
        id: string,
        data: UpdateEquipmentRequestDto,
        performedBy?: string
    ): Promise<EquipmentResponseDto> {
        const existingEquipment = await this.equipmentRepository.findById(id);
        if (!existingEquipment) {
            throw new AppError(ResponseMessage.EQUIPMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const isStatusChanged = data.status && data.status !== existingEquipment.status;

        const updatedEquipment = EquipmentMapper.applyUpdate(existingEquipment, data);

        const savedEquipment = await this.equipmentRepository.save(updatedEquipment);

        // Record History (Event-driven)
        const historyDetails = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");

        this.eventBus.emit(DomainEvents.EQUIPMENT_HISTORY_CREATED, {
            equipmentId: id,
            action: ResponseMessage.ACTION_UPDATED,
            details: historyDetails || ResponseMessage.DETAILS_NO_CHANGES,
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
                            title: ResponseMessage.EQUIPMENT_STATUS_UPDATED_TITLE,
                            message: `Equipment "${savedEquipment.name}" status has been updated to ${savedEquipment.status} by ${performedBy || "System"}.`,
                            link: "/admin/vehicles",
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to send admin notifications for equipment update:", error);
            }
        }

        return EquipmentMapper.toResponseDto(savedEquipment);
    }
}

