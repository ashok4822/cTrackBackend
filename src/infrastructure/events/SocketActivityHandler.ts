import { DomainEvents } from "../../domain/events/IEventBus";
import { 
    GateOperationCreatedPayload, 
    ContainerUpdatedPayload, 
    ContainerCreatedPayload,
    AuditLogCreatedPayload
} from "../../types/eventPayloads";
import { eventBus } from "./EventEmitterBus";
import { socketService } from "../services/socketService";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class SocketActivityHandler {
  constructor() {
    this.initialize();
  }

  private initialize() {
    // 1. Handle Gate Operations
    eventBus.on(DomainEvents.GATE_OPERATION_CREATED, (data: GateOperationCreatedPayload) => {
      try {
        const { operation, data: inputData } = data;
        
        // Emit KPI Update
        socketService.emitKPIUpdate({ 
          type: 'GATE_OPERATION', 
          data: inputData 
        });

        // Emit Activity Log
        socketService.emitActivity({
          type: 'gate',
          title: ResponseMessage.NEW_GATE_MOVEMENT_TITLE,
          description: `${inputData.containerNumber} - ${inputData.type}`,
          timestamp: new Date()
        });
        
        console.log(`[SocketActivityHandler] Emitted socket updates for Gate Operation: ${inputData.containerNumber}`);
      } catch (error) {
        console.error("[SocketActivityHandler] Failed to emit socket update for Gate Operation:", error);
      }
    });

    // 2. Handle Container Updates
    eventBus.on(DomainEvents.CONTAINER_UPDATED, (data: ContainerUpdatedPayload) => {
      try {
        const { newContainer, oldContainer } = data;
        
        socketService.emitKPIUpdate({ 
          type: 'CONTAINER_UPDATE', 
          data: newContainer 
        });

        if (newContainer.status !== oldContainer.status) {
            socketService.emitActivity({
                type: 'container',
                title: ResponseMessage.CONTAINER_STATUS_CHANGED_TITLE,
                description: `${newContainer.containerNumber}: ${oldContainer.status} -> ${newContainer.status}`,
                timestamp: new Date()
            });
        }
      } catch (error) {
        console.error("[SocketActivityHandler] Failed to emit socket update for Container Update:", error);
      }
    });

    // 3. Handle Container Creation
    eventBus.on(DomainEvents.CONTAINER_CREATED, (data: ContainerCreatedPayload) => {
        try {
            socketService.emitKPIUpdate({ type: 'CONTAINER_CREATED', data: data.inputData });
            socketService.emitActivity({
                type: 'CONTAINER',
                title: ResponseMessage.NEW_CONTAINER_ADDED_TITLE,
                description: `${data.inputData.containerNumber} added to yard`,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("[SocketActivityHandler] Failed to emit socket update for Container Creation:", error);
        }
    });

    // 4. Handle Container Blacklisting
    eventBus.on(DomainEvents.CONTAINER_BLACKLISTED, (data: any) => {
        try {
            socketService.emitAlert({
                type: 'warning',
                title: ResponseMessage.CONTAINER_BLACKLISTED_TITLE,
                message: `Container ${data.id} has been moved to blacklist`,
                id: `bl-${Date.now()}`
            });
        } catch (error) {
            console.error("[SocketActivityHandler] Failed to emit socket update for Container Blacklisting:", error);
        }
    });
  }
}
