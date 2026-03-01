import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerModel, IContainerDocument } from "../models/ContainerModel";
import { BaseRepository } from "./base/BaseRepository";

export class ContainerRepository extends BaseRepository<Container, IContainerDocument> implements IContainerRepository {
    constructor() {
        super(ContainerModel);
    }

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
            if (Array.isArray(filters.status)) {
                query.status = { $in: filters.status };
            } else {
                query.status = filters.status;
            }
        }

        const containers = await this.model.find(query).exec();
        return containers.map(c => this.toEntity(c));
    }

    protected toEntity(c: IContainerDocument): Container {
        let dwellTime = c.dwellTime;
        if (c.gateInTime) {
            const outTime = c.gateOutTime ? new Date(c.gateOutTime) : new Date();
            const inTime = new Date(c.gateInTime);
            const diffMs = outTime.getTime() - inTime.getTime();
            dwellTime = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
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
            c.cargoDescription,
            c.hazardousClassification,
            c.sealNumber,
            c.damaged,
            c.damageDetails,
            c.blacklisted,
            c.createdAt,
            c.updatedAt
        );
    }

    protected toModelData(container: Container): any {
        return {
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
            cargoDescription: (container as any).cargoDescription,
            hazardousClassification: (container as any).hazardousClassification,
            sealNumber: container.sealNumber,
            damaged: container.damaged,
            damageDetails: container.damageDetails,
            blacklisted: container.blacklisted,
            empty: container.empty,
        };
    }
}
