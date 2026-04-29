"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketActivityHandler = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EventEmitterBus_1 = require("./EventEmitterBus");
const socketService_1 = require("../services/socketService");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class SocketActivityHandler {
    constructor() {
        this.initialize();
    }
    initialize() {
        // 1. Handle Gate Operations
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.GATE_OPERATION_CREATED, (data) => {
            try {
                const { operation, data: inputData } = data;
                // Emit KPI Update
                socketService_1.socketService.emitKPIUpdate({
                    type: 'GATE_OPERATION',
                    data: inputData
                });
                // Emit Activity Log
                socketService_1.socketService.emitActivity({
                    type: 'gate',
                    title: ResponseMessage_1.ResponseMessage.NEW_GATE_MOVEMENT_TITLE,
                    description: `${inputData.containerNumber} - ${inputData.type}`,
                    timestamp: new Date()
                });
                console.log(`[SocketActivityHandler] Emitted socket updates for Gate Operation: ${inputData.containerNumber}`);
            }
            catch (error) {
                console.error("[SocketActivityHandler] Failed to emit socket update for Gate Operation:", error);
            }
        });
        // 2. Handle Container Updates
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.CONTAINER_UPDATED, (data) => {
            try {
                const { newContainer, oldContainer } = data;
                socketService_1.socketService.emitKPIUpdate({
                    type: 'CONTAINER_UPDATE',
                    data: newContainer
                });
                if (newContainer.status !== oldContainer.status) {
                    socketService_1.socketService.emitActivity({
                        type: 'container',
                        title: ResponseMessage_1.ResponseMessage.CONTAINER_STATUS_CHANGED_TITLE,
                        description: `${newContainer.containerNumber}: ${oldContainer.status} -> ${newContainer.status}`,
                        timestamp: new Date()
                    });
                }
            }
            catch (error) {
                console.error("[SocketActivityHandler] Failed to emit socket update for Container Update:", error);
            }
        });
        // 3. Handle Container Creation
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.CONTAINER_CREATED, (data) => {
            try {
                socketService_1.socketService.emitKPIUpdate({ type: 'CONTAINER_CREATED', data: data.inputData });
                socketService_1.socketService.emitActivity({
                    type: 'CONTAINER',
                    title: ResponseMessage_1.ResponseMessage.NEW_CONTAINER_ADDED_TITLE,
                    description: `${data.inputData.containerNumber} added to yard`,
                    timestamp: new Date()
                });
            }
            catch (error) {
                console.error("[SocketActivityHandler] Failed to emit socket update for Container Creation:", error);
            }
        });
        // 4. Handle Container Blacklisting
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.CONTAINER_BLACKLISTED, (data) => {
            try {
                socketService_1.socketService.emitAlert({
                    type: 'warning',
                    title: ResponseMessage_1.ResponseMessage.CONTAINER_BLACKLISTED_TITLE,
                    message: `Container ${data.id} has been moved to blacklist`,
                    id: `bl-${Date.now()}`
                });
            }
            catch (error) {
                console.error("[SocketActivityHandler] Failed to emit socket update for Container Blacklisting:", error);
            }
        });
    }
}
exports.SocketActivityHandler = SocketActivityHandler;
//# sourceMappingURL=SocketActivityHandler.js.map