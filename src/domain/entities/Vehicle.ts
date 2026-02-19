export class Vehicle {
    constructor(
        public readonly id: string | null,
        public readonly vehicleNumber: string,
        public readonly driverName: string,
        public readonly driverPhone: string,
        public readonly type: "truck" | "trailer" | "chassis",
        public readonly status: "active" | "inactive" | "maintenance" = "inactive",
        public readonly gpsDeviceId?: string,
        public readonly currentLocation?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
