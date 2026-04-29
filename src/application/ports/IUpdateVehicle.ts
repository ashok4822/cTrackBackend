import { UpdateVehicleRequestDto, VehicleResponseDto } from "../dto/VehicleDto";

export interface IUpdateVehicle {
    execute(
        id: string,
        data: UpdateVehicleRequestDto
    ): Promise<VehicleResponseDto>;
}
