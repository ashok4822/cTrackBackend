import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerModel, IContainerDocument } from "../models/ContainerModel";

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
            if (!updated) throw new Error("Container not found");
            return this.toEntity(updated);
        } else {
            const newContainer = new ContainerModel(data);
            const saved = await newContainer.save();
            return this.toEntity(saved);
        }
    }

    private toEntity(c: IContainerDocument): Container {
        let dwellTime = c.dwellTime;
        if (c.gateInTime) {
            const outTime = c.gateOutTime ? new Date(c.gateOutTime) : new Date();
            const inTime = new Date(c.gateInTime);
            const diffMs = outTime.getTime() - inTime.getTime();
            dwellTime = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        }

        return new Container(
            c._id.toString(),
            c.containerNumber,
            c.size as "20ft" | "40ft",
            c.type as "standard" | "reefer" | "tank" | "open-top",
            c.status as "pending" | "gate-in" | "in-yard" | "in-transit" | "at-port" | "at-factory" | "gate-out" | "damaged",
            c.shippingLine,
            c.empty,
            c.movementType as "import" | "export" | "domestic",
            c.customer,
            c.yardLocation,
            c.gateInTime,
            c.gateOutTime,
            dwellTime,
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
