import { VehicleCollectionResponseDto, VehicleFiltersDto } from "../dto/VehicleDto";

export interface IGetAllVehicles {
    execute(filters?: VehicleFiltersDto): Promise<VehicleCollectionResponseDto>;
}
