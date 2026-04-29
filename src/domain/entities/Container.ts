export class Container {
    constructor(
        public readonly id: string | null,
        public readonly containerNumber: string,
        public readonly size: "20ft" | "40ft",
        public readonly type: "standard" | "reefer" | "tank" | "open-top",
        public readonly status: "pending" | "gate-in" | "in-yard" | "in-transit" | "at-port" | "at-factory" | "gate-out" | "damaged",
        public readonly shippingLine: string,
        public readonly empty?: boolean,
        public readonly movementType?: "import" | "export" | "domestic",
        public readonly customer?: string,
        public readonly customerName?: string,
        public readonly yardLocation?: { block: string },
        public readonly gateInTime?: Date,
        public readonly gateOutTime?: Date,
        public readonly dwellTime?: number,
        public readonly weight?: number,
        public readonly cargoWeight?: number,
        public readonly cargoDescription?: string,
        public readonly hazardousClassification?: boolean,
        public readonly sealNumber?: string,
        public readonly damaged?: boolean,
        public readonly damageDetails?: string,
        public readonly blacklisted?: boolean,
        public readonly cargoCategory?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }

    update(data: Partial<Container>): Container {
        return new Container(
            this.id,
            data.containerNumber !== undefined ? data.containerNumber : this.containerNumber,
            data.size !== undefined ? data.size : this.size,
            data.type !== undefined ? data.type : this.type,
            data.status !== undefined ? data.status : this.status,
            data.shippingLine !== undefined ? data.shippingLine : this.shippingLine,
            data.empty !== undefined ? data.empty : this.empty,
            data.movementType !== undefined ? data.movementType : this.movementType,
            data.customer !== undefined ? data.customer : this.customer,
            this.customerName,
            data.yardLocation !== undefined ? data.yardLocation : this.yardLocation,
            data.gateInTime !== undefined ? data.gateInTime : this.gateInTime,
            data.gateOutTime !== undefined ? data.gateOutTime : this.gateOutTime,
            data.dwellTime !== undefined ? data.dwellTime : this.dwellTime,
            data.weight !== undefined ? data.weight : this.weight,
            data.cargoWeight !== undefined ? data.cargoWeight : this.cargoWeight,
            data.cargoDescription !== undefined ? data.cargoDescription : this.cargoDescription,
            data.hazardousClassification !== undefined ? data.hazardousClassification : this.hazardousClassification,
            data.sealNumber !== undefined ? data.sealNumber : this.sealNumber,
            data.damaged !== undefined ? data.damaged : this.damaged,
            data.damageDetails !== undefined ? data.damageDetails : this.damageDetails,
            data.blacklisted !== undefined ? data.blacklisted : this.blacklisted,
            data.cargoCategory !== undefined ? data.cargoCategory : this.cargoCategory,
            this.createdAt,
            new Date()
        );
    }
}
