export type AuditAction =
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
    | "CONTAINER_UNBLACKLISTED";

export type EntityType = "User" | "Container" | "ShippingLine" | "Block" | "Auth" | "Profile";

export class AuditLog {
    constructor(
        public readonly id: string | null,
        public readonly userId: string,
        public readonly userRole: string,
        public readonly userName: string,
        public readonly action: AuditAction,
        public readonly entityType: EntityType,
        public readonly entityId: string | null,
        public readonly details: string,
        public readonly ipAddress: string,
        public readonly timestamp: Date = new Date(),
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
