import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { 
    GateOperationCreatedPayload, 
    ContainerUpdatedPayload, 
    ContainerCreatedPayload
} from "../../types/eventPayloads";
import { ISocketService } from "../../application/services/ISocketService";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class SocketActivityHandler {
  constructor(
    private eventBus: IEventBus,
    private socketService: ISocketService
  ) {
    this.initialize();
  }

  private initialize() {
    // 1. Handle Gate Operations
    this.eventBus.on(DomainEvents.GATE_OPERATION_CREATED, (data: GateOperationCreatedPayload) => {
      try {
        const { data: inputData } = data;
        
        // Emit KPI Update
        this.socketService.emitKPIUpdate({ 
          type: 'GATE_OPERATION', 
          data: inputData 
        });

        // Emit Activity Log
        this.socketService.emitActivity({
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
    this.eventBus.on(DomainEvents.CONTAINER_UPDATED, (data: ContainerUpdatedPayload) => {
      try {
        const { newContainer, oldContainer } = data;
        
        this.socketService.emitKPIUpdate({ 
          type: 'CONTAINER_UPDATE', 
          data: newContainer 
        });

        if (newContainer.status !== oldContainer.status) {
            this.socketService.emitActivity({
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
    this.eventBus.on(DomainEvents.CONTAINER_CREATED, (data: ContainerCreatedPayload) => {
        try {
            this.socketService.emitKPIUpdate({ type: 'CONTAINER_CREATED', data: data.inputData });
            this.socketService.emitActivity({
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
    this.eventBus.on(DomainEvents.CONTAINER_BLACKLISTED, (data: { id: string }) => {
        try {
            this.socketService.emitAlert({
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
