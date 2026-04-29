import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { IGetAllVehicles } from "../ports/IGetAllVehicles";
import { VehicleCollectionResponseDto, VehicleFiltersDto } from "../dto/VehicleDto";
import { VehicleMapper } from "../mappers/VehicleMapper";

export class GetAllVehicles implements IGetAllVehicles {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(filters?: VehicleFiltersDto): Promise<VehicleCollectionResponseDto> {
        const vehicles = await this.vehicleRepository.findAll(filters);
        return VehicleMapper.toCollectionResponseDto(vehicles);
    }
}
