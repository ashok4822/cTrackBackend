import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerModel } from "../models/ContainerModel";

export class MongoContainerRepository implements IContainerRepository {
    async findAll(): Promise<Container[]> {
        const containers = await ContainerModel.find();
        return containers.map(this.toEntity);
    }

    async findById(id: string): Promise<Container | null> {
        const container = await ContainerModel.findById(id);
        if (!container) return null;
        return this.toEntity(container);
    }

    async save(container: Container): Promise<void> {
        const data = {
            containerNumber: container.containerNumber,
            size: container.size,
            type: container.type,
            movementType: container.movementType,
            status: container.status,
            shippingLine: container.shippingLine,
            customer: container.customer,
            yardLocation: container.yardLocation,
            gateInTime: container.gateInTime,
            gateOutTime: container.gateOutTime,
            dwellTime: container.dwellTime,
            weight: container.weight,
            sealNumber: container.sealNumber,
            damaged: container.damaged,
            damageDetails: container.damageDetails,
            blacklisted: container.blacklisted,
        };

        if (container.id && container.id.match(/^[0-9a-fA-F]{24}$/)) {
            await ContainerModel.findByIdAndUpdate(container.id, data);
        } else {
            const newContainer = new ContainerModel(data);
            await newContainer.save();
        }
    }

    private toEntity(c: any): Container {
        return new Container(
            c.id,
            c.containerNumber,
            c.size,
            c.type,
            c.status,
            c.shippingLine,
            c.movementType,
            c.customer,
            c.yardLocation,
            c.gateInTime,
            c.gateOutTime,
            c.dwellTime,
            c.weight,
            c.sealNumber,
            c.damaged,
            c.damageDetails,
            c.blacklisted,
            c.createdAt,
            c.updatedAt
        );
    }
}
