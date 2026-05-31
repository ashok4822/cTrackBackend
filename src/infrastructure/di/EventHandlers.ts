import { AuditLogHandler } from "../events/AuditLogHandler";
import { EquipmentHistoryHandler } from "../events/EquipmentHistoryHandler";
import { ContainerHistoryHandler } from "../events/ContainerHistoryHandler";
import { ChargeHistoryHandler } from "../events/ChargeHistoryHandler";
import { SocketActivityHandler } from "../events/SocketActivityHandler";
import { YardManagerHandler } from "../events/YardManagerHandler";
import { BillingSyncHandler } from "../events/BillingSyncHandler";
import { ContainerRequestSyncHandler } from "../events/ContainerRequestSyncHandler";
import { Repositories } from "./Repositories";
import { Services } from "./Services";
import { eventBus } from "../events/EventEmitterBus";

export const initializeEventHandlers = (repositories: Repositories, services: Services) => {
  new AuditLogHandler(repositories.auditLogRepository, eventBus);
  new EquipmentHistoryHandler(repositories.equipmentHistoryRepository, eventBus);
  new ContainerHistoryHandler(repositories.containerHistoryRepository, eventBus);
  new ChargeHistoryHandler(repositories.chargeHistoryRepository, eventBus);
  new SocketActivityHandler(eventBus, services.socketService);
  new YardManagerHandler(repositories.blockRepository, eventBus);
  new BillingSyncHandler(repositories.billRepository, eventBus);
  new ContainerRequestSyncHandler(repositories.containerRequestRepository, eventBus);
};
