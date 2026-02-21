import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";

export class DeleteVehicle {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(id: string): Promise<void> {
        await this.vehicleRepository.delete(id);
    }
}
