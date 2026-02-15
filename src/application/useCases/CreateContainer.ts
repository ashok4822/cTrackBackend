import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";

export class CreateContainer {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(data: {
        containerNumber: string;
        size: "20ft" | "40ft" | "45ft";
        type: "standard" | "reefer" | "tank" | "open-top" | "flat-rack";
        status: "pending" | "gate-in" | "in-yard" | "in-transit" | "at-port" | "at-factory" | "gate-out" | "damaged";
        shippingLine: string;
        movementType?: "import" | "export" | "domestic";
        customer?: string;
        weight?: number;
        sealNumber?: string;
    }): Promise<void> {
        const container = new Container(
            null,
            data.containerNumber,
            data.size,
            data.type,
            data.status,
            data.shippingLine,
            data.movementType,
            data.customer,
            undefined, // yardLocation
            undefined, // gateInTime
            undefined, // gateOutTime
            undefined, // dwellTime
            data.weight,
            data.sealNumber
        );
        await this.containerRepository.save(container);
    }
}
