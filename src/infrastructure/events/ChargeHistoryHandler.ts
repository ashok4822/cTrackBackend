import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { ChargeHistoryCreatedPayload } from "../../types/eventPayloads";
import { IChargeHistoryRepository } from "../../domain/repositories/IChargeHistoryRepository";

export class ChargeHistoryHandler {
  constructor(
    private historyRepository: IChargeHistoryRepository,
    private eventBus: IEventBus
  ) {
    this.initialize();
  }

  private initialize() {
    this.eventBus.on(DomainEvents.CHARGE_HISTORY_CREATED, async (data: ChargeHistoryCreatedPayload) => {
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
