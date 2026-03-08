import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { Equipment, EquipmentStatus, EquipmentType } from "../../domain/entities/Equipment";
import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { socketService } from "../../infrastructure/services/socketService";
import { NotificationModel } from "../../infrastructure/models/NotificationModel";

export class UpdateEquipment {
    constructor(
        private equipmentRepository: IEquipmentRepository,
        private historyRepository: IEquipmentHistoryRepository,
        private userRepository: IUserRepository
    ) { }

    async execute(
        id: string,
        data: Partial<{
            name: string;
            type: EquipmentType;
            status: EquipmentStatus;
            operator: string;
            lastMaintenance: Date;
            nextMaintenance: Date;
        }>,
        performedBy?: string
    ): Promise<Equipment> {
        const existingEquipment = await this.equipmentRepository.findById(id);
        if (!existingEquipment) {
            throw new Error("Equipment not found");
        }

        const isStatusChanged = data.status && data.status !== existingEquipment.status;

        const updatedEquipment = new Equipment(
            id,
            data.name ?? existingEquipment.name,
            data.type ?? existingEquipment.type,
            data.status ?? existingEquipment.status,
            data.operator ?? existingEquipment.operator,
            data.lastMaintenance ?? existingEquipment.lastMaintenance,
            data.nextMaintenance ?? existingEquipment.nextMaintenance
        );

        const savedEquipment = await this.equipmentRepository.save(updatedEquipment);

        // Record History
        const historyDetails = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");

        await this.historyRepository.save(new EquipmentHistory(
            null,
            id,
            "Updated",
            historyDetails || "No changes specified",
            performedBy || "System"
        ));

        // Notify Admins if status changed
        if (isStatusChanged) {
            try {
                const admins = await this.userRepository.findByRole("admin");
                const notificationData = {
                    type: "info" as const,
                    title: "Equipment Status Updated",
                    message: `Equipment "${savedEquipment.name}" status has been updated to ${savedEquipment.status} by ${performedBy || "System"}.`,
                    link: "/admin/vehicles",
                };

                for (const admin of admins) {
                    if (admin.id) {
                        // Save to DB
                        const newNotification = await NotificationModel.create({
                            userId: admin.id,
                            ...notificationData,
                        });

                        // Emit via Socket
                        socketService.emitNotification({
                            ...notificationData,
                            id: newNotification._id.toString(),
                            read: false,
                            timestamp: new Date(),
                        }, admin.id);
                    }
                }
            } catch (error) {
                console.error("Failed to send admin notifications for equipment update:", error);
            }
        }

        return savedEquipment;
    }
}
