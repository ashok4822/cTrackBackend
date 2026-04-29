import { IUpdateVehicle } from "../ports/IUpdateVehicle";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { UpdateVehicleRequestDto, VehicleResponseDto } from "../dto/VehicleDto";
import { VehicleMapper } from "../mappers/VehicleMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class UpdateVehicle implements IUpdateVehicle {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(
        id: string,
        data: UpdateVehicleRequestDto
    ): Promise<VehicleResponseDto> {
        const existingVehicle = await this.vehicleRepository.findById(id);
        if (!existingVehicle) {
            throw new AppError(ResponseMessage.VEHICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const updatedVehicle = VehicleMapper.applyUpdate(existingVehicle, data);

        const saved = await this.vehicleRepository.save(updatedVehicle);
        return VehicleMapper.toResponseDto(saved);
    }
}

