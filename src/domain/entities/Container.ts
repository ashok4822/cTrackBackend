export class Container {
    constructor(
        public readonly id: string | null,
        public readonly containerNumber: string,
        public readonly size: "20ft" | "40ft" | "45ft",
        public readonly type: "standard" | "reefer" | "tank" | "open-top" | "flat-rack",
        public readonly status: "pending" | "gate-in" | "in-yard" | "in-transit" | "at-port" | "at-factory" | "gate-out" | "damaged",
        public readonly shippingLine: string,
        public readonly movementType?: "import" | "export" | "domestic",
        public readonly customer?: string,
        public readonly yardLocation?: { block: string },
        public readonly gateInTime?: Date,
        public readonly gateOutTime?: Date,
        public readonly dwellTime?: number,
        public readonly weight?: number,
        public readonly sealNumber?: string,
        public readonly damaged?: boolean,
        public readonly damageDetails?: string,
        public readonly blacklisted?: boolean,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
