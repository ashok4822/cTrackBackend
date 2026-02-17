import { IContainerRepository } from "../../domain/repositories/IContainerRepository";

export class BlacklistContainer {
    constructor(private containerRepository: IContainerRepository) { }

    async execute(id: string): Promise<void> {
        const container = await this.containerRepository.findById(id);
        if (!container) {
            throw new Error("Container not found");
        }

        const updatedContainer = new (container.constructor as any)(
            container.id,
            container.containerNumber,
            container.size,
            container.type,
            container.status,
            container.shippingLine,
            container.empty,
            container.movementType,
            container.customer,
            container.yardLocation,
            container.gateInTime,
            container.gateOutTime,
            container.dwellTime,
            container.weight,
            container.cargoWeight,
            container.sealNumber,
            container.damaged,
            container.damageDetails,
            true, // blacklisted
            container.createdAt,
            container.updatedAt
        );

        await this.containerRepository.save(updatedContainer);
    }
}
