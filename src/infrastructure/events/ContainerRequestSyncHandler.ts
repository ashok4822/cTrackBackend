import { DomainEvents } from "../../domain/events/IEventBus";
import { GateOperationCreatedPayload } from "../../types/eventPayloads";
import { eventBus } from "./EventEmitterBus";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";

export class ContainerRequestSyncHandler {
    constructor(private requestRepository: IContainerRequestRepository) {
        this.initialize();
    }

    private initialize() {
        // Sync Container Request status when a container gates out
        eventBus.on(DomainEvents.GATE_OPERATION_CREATED, async (data: GateOperationCreatedPayload) => {
            try {
                const { data: inputData } = data;
                
                if (inputData.type === "gate-out" && inputData.containerNumber) {
                    const activeRequest = await this.requestRepository.findByContainerNumber(inputData.containerNumber);
                    
                    if (activeRequest && activeRequest.id && (activeRequest.status === "ready-for-dispatch" || activeRequest.status === "approved")) {
                        await this.requestRepository.update(activeRequest.id, {
                            status: "in-transit",
                            checkpoints: [...(activeRequest.checkpoints || []), {
                                location: "Terminal Gate",
                                status: "gate-out",
                                timestamp: new Date(),
                                remarks: "Container gated out from terminal."
                            }]
                        });
                        console.log(`[ContainerRequestSyncHandler] Updated request status for container ${inputData.containerNumber}`);
                    }
                }
            } catch (error) {
                console.error("[ContainerRequestSyncHandler] Failed to sync request status:", error);
            }
        });
    }
}
