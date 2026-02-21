export type EquipmentStatus = "operational" | "maintenance" | "down" | "idle";
export type EquipmentType = "reach-stacker" | "forklift" | "crane";

export class Equipment {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly type: EquipmentType,
        public readonly status: EquipmentStatus,
        public readonly operator?: string,
        public readonly lastMaintenance?: Date,
        public readonly nextMaintenance?: Date,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
