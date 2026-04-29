import { DomainEvents } from "../../domain/events/IEventBus";
import { EquipmentHistoryCreatedPayload } from "../../types/eventPayloads";
import { eventBus } from "./EventEmitterBus";
import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";

export class EquipmentHistoryHandler {
  constructor(private historyRepository: IEquipmentHistoryRepository) {
    this.initialize();
  }

  private initialize() {
    eventBus.on(DomainEvents.EQUIPMENT_HISTORY_CREATED, async (data: EquipmentHistoryCreatedPayload) => {
      try {
        const history = new EquipmentHistory(
          null,
          data.equipmentId || "Unknown",
          data.action,
          data.details,
          data.performedBy
        );
        await this.historyRepository.save(history);
      } catch (error) {
        console.error("[EquipmentHistoryHandler] Failed to save equipment history:", error);
      }
    });
  }
}
