import { CreateVehicleRequestDto, VehicleResponseDto } from "../dto/VehicleDto";

export interface ICreateVehicle {
    execute(data: CreateVehicleRequestDto): Promise<VehicleResponseDto>;
}
