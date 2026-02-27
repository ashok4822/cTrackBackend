export class ContainerRequest {
    constructor(
        public readonly id: string | null,
        public readonly customerId: string,
        public readonly type: "stuffing" | "destuffing",
        public readonly status: "pending" | "approved" | "rejected" | "completed",

        // Stuffing specific fields
        public readonly containerSize?: string,
        public readonly containerType?: string,
        public readonly cargoDescription?: string,
        public readonly cargoWeight?: number,
        public readonly preferredDate?: Date,
        public readonly specialInstructions?: string,

        // Hazardous classification
        public readonly isHazardous?: boolean,
        public readonly hazardClass?: string,
        public readonly unNumber?: string,
        public readonly packingGroup?: string,

        // Destuffing specific fields
        public readonly containerId?: string,
        public readonly containerNumber?: string,
        public readonly remarks?: string,

        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
