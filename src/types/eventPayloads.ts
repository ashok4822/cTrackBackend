import { Container } from "../domain/entities/Container";
import { GateOperation } from "../domain/entities/GateOperation";
import { Block } from "../domain/entities/Block";
import { AuditAction, EntityType } from "../domain/entities/AuditLog";

export interface AuditLogCreatedPayload {
  userId: string;
  userRole: string;
  userName: string;
  action: AuditAction;
  resourceType: EntityType;
  resourceId: string | null;
  details: Record<string, unknown>;
  ipAddress: string;
}

export interface ContainerUpdatedPayload {
  oldContainer: Container;
  newContainer: Container;
  performedBy?: string;
  equipmentName?: string;
  userContext?: Record<string, unknown>;
}

export interface ContainerCreatedPayload {
  container: Container;
  inputData: Record<string, unknown>;
}

export interface GateOperationCreatedPayload {
  operation: GateOperation;
  data: Record<string, unknown>;
  performedBy: string;
  updatedContainer: Container | null;
}

export interface ContainerHistoryCreatedPayload {
  containerId: string;
  action: string;
  details: string;
  performedBy: string;
}

export interface EquipmentHistoryCreatedPayload {
  equipmentId?: string;
  equipmentName?: string;
  action: string;
  details: string;
  performedBy: string;
}

export interface ChargeHistoryCreatedPayload {
  chargeId: string;
  activityName: string;
  containerSize: string;
  containerType: string;
  oldRate: number;
  newRate: number;
  currency: string;
  changedAt?: Date;
}

export interface YardBlockUpdatedPayload {
  action: string;
  blockId: string;
  data: Partial<Block>;
}

export interface YardBlockCreatedPayload {
  action: string;
  block: Block;
}
