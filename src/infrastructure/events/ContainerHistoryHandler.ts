import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { ContainerUpdatedPayload } from "../../types/eventPayloads";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class ContainerHistoryHandler {
  constructor(
    private historyRepository: IContainerHistoryRepository,
    private eventBus: IEventBus
  ) {
    this.initialize();
  }
  private initialize() {
    // Handle full container updates with automatic diffing for history
    this.eventBus.on(DomainEvents.CONTAINER_UPDATED, async (data: ContainerUpdatedPayload) => {
      try {
        const { oldContainer, newContainer, performedBy, equipmentName } = data;
        const historyRecords: ContainerHistory[] = [];

        const logChange = (action: string, details: string) => {
          historyRecords.push(new ContainerHistory(null, newContainer.id!, action, details, performedBy));
        };

        // 1. Status Change
        if (newContainer.status !== oldContainer.status) {
          logChange(ResponseMessage.ACTION_STATUS_CHANGED, `Status updated from ${oldContainer.status} to ${newContainer.status}`);
        }

        // 2. Location Change
        if (newContainer.yardLocation?.block !== oldContainer.yardLocation?.block) {
          logChange(ResponseMessage.ACTION_LOCATION_UPDATED, `Location updated from ${oldContainer.yardLocation?.block || "None"} to ${newContainer.yardLocation?.block || "Gate"}`);
          
          if (equipmentName) {
            // This might trigger an EQUIPMENT_HISTORY_CREATED event in a more advanced setup, 
            // but for now, we'll keep it simple or emit another event.
            this.eventBus.emit(DomainEvents.EQUIPMENT_HISTORY_CREATED, {
                equipmentName, // Handler needs to find ID
                action: ResponseMessage.ACTION_SHIFT_OPERATION,
                details: `Shifted container ${newContainer.containerNumber} to ${newContainer.yardLocation?.block || "Unknown"}`,
                performedBy
            });
          }
        }

        // 3. Weight Changes
        if (newContainer.weight !== oldContainer.weight) {
          logChange(ResponseMessage.ACTION_WEIGHT_UPDATED, `Weight updated from ${oldContainer.weight || "None"} to ${newContainer.weight} kg`);
        }

        // 4. Seal Number
        if (newContainer.sealNumber !== oldContainer.sealNumber) {
          logChange(ResponseMessage.ACTION_SEAL_NUMBER_UPDATED, `Seal number changed from ${oldContainer.sealNumber || "None"} to ${newContainer.sealNumber}`);
        }

        // 5. Damage Status
        if (newContainer.damaged !== oldContainer.damaged) {
          logChange(ResponseMessage.ACTION_DAMAGE_STATUS_UPDATED, `Damage status changed to ${newContainer.damaged ? "Damaged" : "Undamaged"}`);
        }

        // Save all records
        for (const record of historyRecords) {
          await this.historyRepository.save(record);
        }
      } catch (error) {
        console.error("[ContainerHistoryHandler] Failed to process CONTAINER_UPDATED:", error);
      }
    });
  }
}
