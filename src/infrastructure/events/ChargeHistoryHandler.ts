import { DomainEvents } from "../../domain/events/IEventBus";
import { ChargeHistoryCreatedPayload } from "../../types/eventPayloads";
import { eventBus } from "./EventEmitterBus";
import { IChargeHistoryRepository } from "../../domain/repositories/IChargeHistoryRepository";

export class ChargeHistoryHandler {
  constructor(private historyRepository: IChargeHistoryRepository) {
    this.initialize();
  }

  private initialize() {
    eventBus.on(DomainEvents.CHARGE_HISTORY_CREATED, async (data: ChargeHistoryCreatedPayload) => {
      try {
        await this.historyRepository.save({
          chargeId: data.chargeId,
          activityName: data.activityName,
          containerSize: data.containerSize,
          containerType: data.containerType,
          oldRate: data.oldRate,
          newRate: data.newRate,
          currency: data.currency,
          changedAt: data.changedAt || new Date()
        });
      } catch (error) {
        console.error("[ChargeHistoryHandler] Failed to save charge history:", error);
      }
    });
  }
}
