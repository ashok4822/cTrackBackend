export class Equipment {
    constructor(
        public readonly id: string | null,
        public readonly name: string,
        public readonly type: "reach-stacker" | "forklift" | "crane" | "straddle-carrier",
        public readonly status: "operational" | "maintenance" | "down" = "operational",
        public readonly lastMaintenance?: Date,
        public readonly nextMaintenance?: Date,
        public readonly operator?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
