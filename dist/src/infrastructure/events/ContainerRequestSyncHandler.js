"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRequestSyncHandler = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EventEmitterBus_1 = require("./EventEmitterBus");
class ContainerRequestSyncHandler {
    requestRepository;
    constructor(requestRepository) {
        this.requestRepository = requestRepository;
        this.initialize();
    }
    initialize() {
        // Sync Container Request status when a container gates out
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.GATE_OPERATION_CREATED, async (data) => {
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
            }
            catch (error) {
                console.error("[ContainerRequestSyncHandler] Failed to sync request status:", error);
            }
        });
    }
}
exports.ContainerRequestSyncHandler = ContainerRequestSyncHandler;
//# sourceMappingURL=ContainerRequestSyncHandler.js.map