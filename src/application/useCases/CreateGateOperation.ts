import { IGateOperationRepository } from "../../domain/repositories/IGateOperationRepository";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IBillRepository } from "../../domain/repositories/IBillRepository";

import { ICreateGateOperation } from "../ports/ICreateGateOperation";
import { CreateGateOperationRequestDto } from "../dto/GateDto";
import { UserContextDto } from "../dto/CommonDto";
import { AppError } from "../../domain/exceptions/AppError";
import { GateMapper } from "../mappers/GateMapper";

import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { IContainerDomainService } from "../../domain/services/IContainerDomainService";
import { IVehicleDomainService } from "../../domain/services/IVehicleDomainService";
import { IBlockDomainService } from "../../domain/services/IBlockDomainService";
import type { Container } from "../../domain/entities/Container";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateGateOperation implements ICreateGateOperation {
  constructor(
    private readonly _gateOperationRepository: IGateOperationRepository,
    private readonly _vehicleRepository: IVehicleRepository,
    private readonly _containerRepository: IContainerRepository,
    private readonly _containerRequestRepository: IContainerRequestRepository,
    private readonly _vehicleService: IVehicleDomainService,
    private readonly _containerService: IContainerDomainService,
    private readonly _blockService: IBlockDomainService,
    private readonly _eventBus: IEventBus,
    private readonly _billRepository?: IBillRepository,
  ) { }


  async execute(
    data: CreateGateOperationRequestDto,
    userContext?: UserContextDto,
    performedBy: string = "Operator",
  ): Promise<void> {
    // 1. Initial State Fetching
    const vehicles = await this._vehicleRepository.findAll({ vehicleNumber: data.vehicleNumber });
    const vehicle = vehicles.length > 0 ? vehicles[0] : null;

    let container = null;
    if (data.containerNumber) {
      container = await this._containerService.findByNumber(data.containerNumber);
    }

    // 2. Gate-In/Out Specific Validations
    if (data.type === "gate-in") {
      if (vehicle && vehicle.status === "in-yard") {
        throw new AppError(`${ResponseMessage.VEHICLE_ALREADY_IN_YARD} (${data.vehicleNumber})`);
      }
      if (container && container.status !== "gate-out" && container.status !== "pending") {
        throw new AppError(`${ResponseMessage.CONTAINER_ALREADY_IN_TERMINAL} (${data.containerNumber})`);
      }
    } else {
      // Gate-out validations
      if (container && container.id && this._billRepository) {
        const bills = await this._billRepository.findByContainerId(container.id);
        const hasPendingBills = bills.some(b => b.status === "pending" || b.status === "overdue");
        if (hasPendingBills) {
          throw new AppError(`${ResponseMessage.PENDING_BILLS_ERROR} (${data.containerNumber})`);
        }
      }

      if (container && container.customer) {
        const request = await this._containerRequestRepository.findByContainerNumber(container.containerNumber);
        if (!request || request.status !== "ready-for-dispatch") {
          throw new AppError(`${ResponseMessage.NOT_READY_FOR_DISPATCH_ERROR} (${data.containerNumber})`);
        }
      }
    }

    if (container && container.blacklisted) {
      throw new AppError(`${ResponseMessage.CONTAINER_BLACKLISTED_ERROR} (${data.containerNumber})`);
    }

    // 3. Process Domain Aggregates
    let updatedContainer: Container | null = null;

    if (data.type === "gate-in") {
      await this._vehicleService.processGateIn(data);
      if (data.containerNumber) {
        updatedContainer = await this._containerService.processGateIn(data, container);
      }
    } else {
      if (vehicle) await this._vehicleService.processGateOut(vehicle);
      if (container) {
        updatedContainer = await this._containerService.processGateOut(container);
      }
    }

    // 4. Persistence & Record Keeping
    const operation = GateMapper.toEntity(data, data.approvedBy);
    await this._gateOperationRepository.save(operation);

    if (updatedContainer) {
      const savedContainer = await this._containerRepository.save(updatedContainer);
      updatedContainer = savedContainer; // Use saved version with ID

      // History & Event-driven Audit
      if (savedContainer.id) {
        this._eventBus.emit(DomainEvents.CONTAINER_HISTORY_CREATED, {
          containerId: savedContainer.id,
          action: data.type === "gate-in" ? ResponseMessage.ACTION_GATE_IN : ResponseMessage.ACTION_GATE_OUT,
          details: `${data.type === "gate-in" ? ResponseMessage.DETAILS_GATE_IN : ResponseMessage.DETAILS_GATE_OUT} with vehicle ${data.vehicleNumber}`,
          performedBy
        });

        if (userContext) {
          this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
            userId: userContext.userId,
            userRole: userContext.userRole,
            userName: userContext.userName,
            action: data.type === "gate-in" ? ResponseMessage.AUDIT_GATE_IN : ResponseMessage.AUDIT_GATE_OUT,
            resourceType: ResponseMessage.RESOURCE_CONTAINER,
            resourceId: savedContainer.id,
            details: { containerNumber: savedContainer.containerNumber, vehicleNumber: data.vehicleNumber },
            ipAddress: userContext.ipAddress
          });
        }
      }
    }

    // Emit Gate Operation Created Event for downstream side-effects (Sockets, Syncs, Occupancy)
    this._eventBus.emit(DomainEvents.GATE_OPERATION_CREATED, {
        operation,
        data,
        performedBy,
        updatedContainer // Crucial for YardManagerHandler to know which block to decrement
    });
  }
}

