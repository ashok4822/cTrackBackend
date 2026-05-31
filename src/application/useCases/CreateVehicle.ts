import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { ICreateVehicle } from "../ports/ICreateVehicle";
import { CreateVehicleRequestDto, VehicleResponseDto } from "../dto/VehicleDto";
import { VehicleMapper } from "../mappers/VehicleMapper";

export class CreateVehicle implements ICreateVehicle {
    constructor(private readonly _vehicleRepository: IVehicleRepository) { }

    async execute(data: CreateVehicleRequestDto): Promise<VehicleResponseDto> {
        const existingVehicles = await this._vehicleRepository.findAll({ vehicleNumber: data.vehicleNumber });
        const existingVehicle = existingVehicles.find((v) => v.vehicleNumber.toLowerCase() === data.vehicleNumber.toLowerCase());

        if (existingVehicle) {
            // Logic: if already exists, update info and status via re-entry
            const updatedVehicle = VehicleMapper.applyReEntry(existingVehicle, data);
            const saved = await this._vehicleRepository.save(updatedVehicle);
            return VehicleMapper.toResponseDto(saved);
        }

        const vehicle = VehicleMapper.toEntity(data);
        const saved = await this._vehicleRepository.save(vehicle);
        return VehicleMapper.toResponseDto(saved);
    }
}
