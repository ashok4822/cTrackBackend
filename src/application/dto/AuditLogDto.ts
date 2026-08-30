// ─── Audit Log DTOs ───────────────────────────────────────────────────────────

export type AuditActionDto =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_BLOCKED"
  | "USER_UNBLOCKED"
  | "USER_LOGIN"
  | "PROFILE_UPDATED"
  | "PASSWORD_CHANGED"
  | "BLOCK_CREATED"
  | "BLOCK_UPDATED"
  | "SHIPPING_LINE_CREATED"
  | "SHIPPING_LINE_UPDATED"
  | "CONTAINER_CREATED"
  | "CONTAINER_UPDATED"
  | "CONTAINER_BLACKLISTED"
  | "CONTAINER_UNBLACKLISTED"
  | "REQUEST_CREATED"
  | "REQUEST_UPDATED"
  | "BILL_PAID"
  | "SIGNUP"
  | "CONTAINER_GATE_IN"
  | "CONTAINER_GATE_OUT";

export type EntityTypeDto = "User" | "Container" | "ShippingLine" | "Block" | "Auth" | "Profile" | "Request" | "Bill";

export class CreateAuditLogRequestDto {
  userId!: string;
  userRole!: string;
  userName!: string;
  action!: AuditActionDto;
  entityType!: EntityTypeDto;
  entityId?: string;
  details!: string;
  ipAddress!: string;
}

export class AuditLogResponseDto {
  id!: string | null;
  userId!: string;
  userRole!: string;
  userName!: string;
  action!: AuditActionDto;
  entityType!: EntityTypeDto;
  entityId!: string | null;
  details!: string;
  ipAddress!: string;
  timestamp!: Date;
  createdAt?: Date;
}

export class AuditLogCollectionResponseDto {
  logs!: AuditLogResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
}

export class AuditLogFiltersDto {
  page?: number;
  limit?: number;
  userId?: string;
  action?: AuditActionDto;
  entityType?: EntityTypeDto;
  startDate?: Date;
  endDate?: Date;
}

