import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { IDeleteVehicle } from "../ports/IDeleteVehicle";

export class DeleteVehicle implements IDeleteVehicle {
    constructor(private vehicleRepository: IVehicleRepository) { }

    async execute(id: string): Promise<void> {
        await this.vehicleRepository.delete(id);
    }
}
