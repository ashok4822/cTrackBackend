import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerModel } from "../models/ContainerModel";

export class ContainerRepository implements IContainerRepository {
    async findAll(filters?: {
        containerNumber?: string;
        size?: string;
        type?: string;
        block?: string;
        status?: string;
    }): Promise<Container[]> {
        const query: any = {};

        if (filters?.containerNumber) {
            query.containerNumber = { $regex: `^${filters.containerNumber}$`, $options: "i" };
        }
        if (filters?.size) {
            query.size = filters.size;
        }
        if (filters?.type) {
            query.type = filters.type.toLowerCase();
        }
        if (filters?.block) {
            query["yardLocation.block"] = filters.block;
        }
        if (filters?.status) {
            query.status = filters.status;
        }

        const containers = await ContainerModel.find(query);
        return containers.map(this.toEntity);
    }

    async findById(id: string): Promise<Container | null> {
        const container = await ContainerModel.findById(id);
        if (!container) return null;
        return this.toEntity(container);
    }

    async save(container: Container): Promise<Container> {
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
            cargoWeight: container.cargoWeight,
            sealNumber: container.sealNumber,
            damaged: container.damaged,
            damageDetails: container.damageDetails,
            blacklisted: container.blacklisted,
            empty: container.empty,
        };

        if (container.id && container.id.match(/^[0-9a-fA-F]{24}$/)) {
            const updated = await ContainerModel.findByIdAndUpdate(container.id, data, { new: true });
            return this.toEntity(updated);
        } else {
            const newContainer = new ContainerModel(data);
            const saved = await newContainer.save();
            return this.toEntity(saved);
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
            c.empty,
            c.movementType,
            c.customer,
            c.yardLocation,
            c.gateInTime,
            c.gateOutTime,
            c.dwellTime,
            c.weight,
            c.cargoWeight,
            c.sealNumber,
            c.damaged,
            c.damageDetails,
            c.blacklisted,
            c.createdAt,
            c.updatedAt
        );
    }
}
