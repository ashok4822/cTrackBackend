import { BaseFilterDto } from "./CommonDto";

export class CreateVehicleRequestDto {
  vehicleNumber!: string;
  driverName!: string;
  driverPhone!: string;
  type!: "truck" | "trailer" | "chassis";
  gpsDeviceId?: string;
  currentLocation?: string;
}

export class UpdateVehicleRequestDto {
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  type?: "truck" | "trailer" | "chassis";
  status?: "in-yard" | "out-of-yard";
  gpsDeviceId?: string;
  currentLocation?: string;
}

export class VehicleFiltersDto extends BaseFilterDto {
  type?: string;
  vehicleNumber?: string;
  status?: string;
}

export class VehicleResponseDto {
  id?: string;
  vehicleNumber!: string;
  driverName!: string;
  driverPhone!: string;
  type!: string;
  status!: string;
  gpsDeviceId?: string;
  currentLocation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class VehicleCollectionResponseDto {
  items!: VehicleResponseDto[];
  total!: number;
}
