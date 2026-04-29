import { Vehicle } from "../../domain/entities/Vehicle";
import { 
  CreateVehicleRequestDto,
  UpdateVehicleRequestDto,
  VehicleResponseDto, 
  VehicleCollectionResponseDto 
} from "../dto/VehicleDto";

export class VehicleMapper {
  static toEntity(dto: CreateVehicleRequestDto): Vehicle {
    return new Vehicle(
      undefined,
      dto.vehicleNumber,
      dto.driverName,
      dto.driverPhone,
      dto.type,
      "out-of-yard",
      dto.gpsDeviceId,
      dto.currentLocation
    );
  }

  /** Apply an update to an existing Vehicle entity */
  static applyUpdate(existing: Vehicle, data: UpdateVehicleRequestDto): Vehicle {
    return new Vehicle(
      existing.id,
      data.vehicleNumber ?? existing.vehicleNumber,
      data.driverName ?? existing.driverName,
      data.driverPhone ?? existing.driverPhone,
      data.type ?? existing.type,
      existing.status,
      data.gpsDeviceId ?? existing.gpsDeviceId,
      data.currentLocation ?? existing.currentLocation
    );
  }

  /** Re-register an existing Vehicle on yard re-entry */
  static applyReEntry(existing: Vehicle, data: CreateVehicleRequestDto): Vehicle {
    return new Vehicle(
      existing.id,
      data.vehicleNumber,
      data.driverName,
      data.driverPhone,
      data.type,
      "in-yard",
      data.gpsDeviceId || existing.gpsDeviceId,
      data.currentLocation || "Gate In",
      existing.createdAt,
      new Date()
    );
  }

  static toResponseDto(vehicle: Vehicle): VehicleResponseDto {
    return {
      id: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      driverName: vehicle.driverName,
      driverPhone: vehicle.driverPhone,
      type: vehicle.type,
      status: vehicle.status,
      gpsDeviceId: vehicle.gpsDeviceId,
      currentLocation: vehicle.currentLocation,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };
  }

  static toCollectionResponseDto(vehicles: Vehicle[]): VehicleCollectionResponseDto {
    return {
      items: vehicles.map(v => this.toResponseDto(v)),
      total: vehicles.length,
    };
  }
}
