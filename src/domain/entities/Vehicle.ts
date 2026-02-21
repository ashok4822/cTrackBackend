export type VehicleType = "truck" | "trailer" | "chassis";

export class Vehicle {
    constructor(
        public readonly id: string | undefined,
        public readonly vehicleNumber: string,
        public readonly driverName: string,
        public readonly driverPhone: string,
        public readonly type: VehicleType,
        public readonly status: "in-yard" | "out-of-yard" = "out-of-yard",
        public readonly gpsDeviceId?: string,
        public readonly currentLocation?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
