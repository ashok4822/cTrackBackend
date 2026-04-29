import { BaseFilterDto } from "./CommonDto";

export interface CreateVehicleRequestDto {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  type: "truck" | "trailer" | "chassis";
  gpsDeviceId?: string;
  currentLocation?: string;
}

export interface UpdateVehicleRequestDto {
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  type?: "truck" | "trailer" | "chassis";
  status?: "in-yard" | "out-of-yard";
  gpsDeviceId?: string;
  currentLocation?: string;
}

export interface VehicleFiltersDto extends BaseFilterDto {
  type?: string;
  vehicleNumber?: string;
  status?: string;
}

export interface VehicleResponseDto {
  id?: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  type: string;
  status: string;
  gpsDeviceId?: string;
  currentLocation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleCollectionResponseDto {
  items: VehicleResponseDto[];
  total: number;
}
