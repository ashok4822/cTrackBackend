import { UserRepository } from "../repositories/UserRepository";
import { OtpRepository } from "../repositories/OtpRepository";
import { ActivityRepository } from "../repositories/ActivityRepository";
import { ChargeRepository } from "../repositories/ChargeRepository";
import { PDARepository } from "../repositories/PDARepository";
import { CargoCategoryRepository } from "../repositories/CargoCategoryRepository";
import { BillTransactionRepository } from "../repositories/BillTransactionRepository";
import { ContainerRepository } from "../repositories/ContainerRepository";
import { EquipmentRepository } from "../repositories/EquipmentRepository";
import { GateOperationRepository } from "../repositories/GateOperationRepository";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { ShippingLineRepository } from "../repositories/ShippingLineRepository";
import { MongoNotificationRepository } from "../repositories/MongoNotificationRepository";
import { MongoAuditLogRepository } from "../repositories/MongoAuditLogRepository";
import { EquipmentHistoryRepository } from "../repositories/EquipmentHistoryRepository";
import { ContainerHistoryRepository } from "../repositories/ContainerHistoryRepository";
import { ChargeHistoryRepository } from "../repositories/ChargeHistoryRepository";
import { BillRepository } from "../repositories/BillRepository";
import { BlockRepository } from "../repositories/BlockRepository";
import { ContainerRequestRepository } from "../repositories/ContainerRequestRepository";

export const createRepositories = () => {
  return {
    userRepository: new UserRepository(),
    otpRepository: new OtpRepository(),
    auditLogRepository: new MongoAuditLogRepository(),
    activityRepository: new ActivityRepository(),
    chargeRepository: new ChargeRepository(),
    chargeHistoryRepository: new ChargeHistoryRepository(),
    billRepository: new BillRepository(),
    pdaRepository: new PDARepository(),
    cargoCategoryRepository: new CargoCategoryRepository(),
    billTransactionRepository: new BillTransactionRepository(),
    containerRepository: new ContainerRepository(),
    containerHistoryRepository: new ContainerHistoryRepository(),
    equipmentRepository: new EquipmentRepository(),
    equipmentHistoryRepository: new EquipmentHistoryRepository(),
    blockRepository: new BlockRepository(),
    containerRequestRepository: new ContainerRequestRepository(),
    gateOperationRepository: new GateOperationRepository(),
    vehicleRepository: new VehicleRepository(),
    shippingLineRepository: new ShippingLineRepository(),
    notificationRepository: new MongoNotificationRepository(),
  };
};

export type Repositories = ReturnType<typeof createRepositories>;
