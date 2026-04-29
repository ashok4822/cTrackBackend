"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGateOperation = void 0;
const AppError_1 = require("../../domain/exceptions/AppError");
const GateMapper_1 = require("../mappers/GateMapper");
const IEventBus_1 = require("../../domain/events/IEventBus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateGateOperation {
    gateOperationRepository;
    vehicleRepository;
    containerRepository;
    containerRequestRepository;
    vehicleService;
    containerService;
    blockService;
    eventBus;
    billRepository;
    constructor(gateOperationRepository, vehicleRepository, containerRepository, containerRequestRepository, vehicleService, containerService, blockService, eventBus, billRepository) {
        this.gateOperationRepository = gateOperationRepository;
        this.vehicleRepository = vehicleRepository;
        this.containerRepository = containerRepository;
        this.containerRequestRepository = containerRequestRepository;
        this.vehicleService = vehicleService;
        this.containerService = containerService;
        this.blockService = blockService;
        this.eventBus = eventBus;
        this.billRepository = billRepository;
    }
    async execute(data, userContext, performedBy = "Operator") {
        // 1. Initial State Fetching
        const vehicles = await this.vehicleRepository.findAll({ vehicleNumber: data.vehicleNumber });
        const vehicle = vehicles.length > 0 ? vehicles[0] : null;
        let container = null;
        if (data.containerNumber) {
            container = await this.containerService.findByNumber(data.containerNumber);
        }
        // 2. Gate-In/Out Specific Validations
        if (data.type === "gate-in") {
            if (vehicle && vehicle.status === "in-yard") {
                throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.VEHICLE_ALREADY_IN_YARD} (${data.vehicleNumber})`);
            }
            if (container && container.status !== "gate-out" && container.status !== "pending") {
                throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.CONTAINER_ALREADY_IN_TERMINAL} (${data.containerNumber})`);
            }
        }
        else {
            // Gate-out validations
            if (container && container.id && this.billRepository) {
                const bills = await this.billRepository.findByContainerId(container.id);
                const hasPendingBills = bills.some(b => b.status === "pending" || b.status === "overdue");
                if (hasPendingBills) {
                    throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.PENDING_BILLS_ERROR} (${data.containerNumber})`);
                }
            }
            if (container && container.customer) {
                const request = await this.containerRequestRepository.findByContainerNumber(container.containerNumber);
                if (!request || request.status !== "ready-for-dispatch") {
                    throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.NOT_READY_FOR_DISPATCH_ERROR} (${data.containerNumber})`);
                }
            }
        }
        if (container && container.blacklisted) {
            throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.CONTAINER_BLACKLISTED_ERROR} (${data.containerNumber})`);
        }
        // 3. Process Domain Aggregates
        let updatedContainer = null;
        if (data.type === "gate-in") {
            await this.vehicleService.processGateIn(data);
            if (data.containerNumber) {
                updatedContainer = await this.containerService.processGateIn(data, container);
            }
        }
        else {
            if (vehicle)
                await this.vehicleService.processGateOut(vehicle);
            if (container) {
                updatedContainer = await this.containerService.processGateOut(container);
            }
        }
        // 4. Persistence & Record Keeping
        const operation = GateMapper_1.GateMapper.toEntity(data, data.approvedBy);
        await this.gateOperationRepository.save(operation);
        if (updatedContainer) {
            const savedContainer = await this.containerRepository.save(updatedContainer);
            updatedContainer = savedContainer; // Use saved version with ID
            // History & Event-driven Audit
            if (savedContainer.id) {
                this.eventBus.emit(IEventBus_1.DomainEvents.CONTAINER_HISTORY_CREATED, {
                    containerId: savedContainer.id,
                    action: data.type === "gate-in" ? ResponseMessage_1.ResponseMessage.ACTION_GATE_IN : ResponseMessage_1.ResponseMessage.ACTION_GATE_OUT,
                    details: `${data.type === "gate-in" ? ResponseMessage_1.ResponseMessage.DETAILS_GATE_IN : ResponseMessage_1.ResponseMessage.DETAILS_GATE_OUT} with vehicle ${data.vehicleNumber}`,
                    performedBy
                });
                if (userContext) {
                    this.eventBus.emit(IEventBus_1.DomainEvents.AUDIT_LOG_CREATED, {
                        userId: userContext.userId,
                        userRole: userContext.userRole,
                        userName: userContext.userName,
                        action: data.type === "gate-in" ? ResponseMessage_1.ResponseMessage.AUDIT_GATE_IN : ResponseMessage_1.ResponseMessage.AUDIT_GATE_OUT,
                        resourceType: ResponseMessage_1.ResponseMessage.RESOURCE_CONTAINER,
                        resourceId: savedContainer.id,
                        details: { containerNumber: savedContainer.containerNumber, vehicleNumber: data.vehicleNumber },
                        ipAddress: userContext.ipAddress
                    });
                }
            }
        }
        // Emit Gate Operation Created Event for downstream side-effects (Sockets, Syncs, Occupancy)
        this.eventBus.emit(IEventBus_1.DomainEvents.GATE_OPERATION_CREATED, {
            operation,
            data,
            performedBy,
            updatedContainer // Crucial for YardManagerHandler to know which block to decrement
        });
    }
}
exports.CreateGateOperation = CreateGateOperation;
//# sourceMappingURL=CreateGateOperation.js.map