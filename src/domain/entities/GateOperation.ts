export class GateOperation {
    constructor(
        public readonly id: string | null,
        public readonly type: "gate-in" | "gate-out",
        public readonly containerNumber: string,
        public readonly vehicleNumber: string,
        public readonly driverName: string,
        public readonly purpose: "port" | "factory" | "transfer",
        public readonly status: "pending" | "approved" | "completed" | "rejected",
        public readonly timestamp: Date,
        public readonly approvedBy?: string,
        public readonly remarks?: string
    ) { }
}
