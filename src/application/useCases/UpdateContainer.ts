import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";

export class UpdateContainer {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(id: string, data: Partial<Container>): Promise<void> {
        const container = await this.containerRepository.findById(id);
        if (!container) {
            throw new Error("Container not found");
        }

        const updatedContainer = new Container(
            container.id,
            data.containerNumber !== undefined ? data.containerNumber : container.containerNumber,
            data.size !== undefined ? (data.size as any) : container.size,
            data.type !== undefined ? (data.type as any) : container.type,
            data.status !== undefined ? (data.status as any) : container.status,
            data.shippingLine !== undefined ? data.shippingLine : container.shippingLine,
            data.empty !== undefined ? data.empty : container.empty,
            data.movementType !== undefined ? (data.movementType as any) : container.movementType,
            data.customer !== undefined ? data.customer : container.customer,
            data.yardLocation !== undefined ? data.yardLocation : container.yardLocation,
            data.gateInTime !== undefined ? data.gateInTime : container.gateInTime,
            data.gateOutTime !== undefined ? data.gateOutTime : container.gateOutTime,
            data.dwellTime !== undefined ? data.dwellTime : container.dwellTime,
            data.weight !== undefined ? data.weight : container.weight,
            data.cargoWeight !== undefined ? data.cargoWeight : container.cargoWeight,
            data.sealNumber !== undefined ? data.sealNumber : container.sealNumber,
            data.damaged !== undefined ? data.damaged : container.damaged,
            data.damageDetails !== undefined ? data.damageDetails : container.damageDetails,
            data.blacklisted !== undefined ? data.blacklisted : container.blacklisted,
            container.createdAt,
            container.updatedAt
        );

        await this.containerRepository.save(updatedContainer);
    }
}
