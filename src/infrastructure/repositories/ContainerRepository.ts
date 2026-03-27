import mongoose, { UpdateQuery } from "mongoose";
import { IContainerRepository, ContainerFilter } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerModel, IContainerDocument } from "../models/ContainerModel";
import { BaseRepository } from "./base/BaseRepository";
import { UserModel } from "../models/UserModel";

export class ContainerRepository extends BaseRepository<Container, IContainerDocument> implements IContainerRepository {
    constructor() {
        super(ContainerModel);
    }

    async findById(id: string): Promise<Container | null> {
        const doc = await this.model.findById(id).exec();
        if (!doc) return null;
        const [container] = await this.mapWithCustomers([doc]);
        return container;
    }

    async findAll(filters?: ContainerFilter): Promise<Container[]> {
        const query: Record<string, unknown> = {};

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
        if (filters?.customer) {
            query.customer = filters.customer;
        }
        if (filters?.empty !== undefined) {
            query.empty = filters.empty;
        }

        const containers = await this.model.find(query).exec();
        return this.mapWithCustomers(containers);
    }

    protected async mapWithCustomers(docs: IContainerDocument[]): Promise<Container[]> {
        if (docs.length === 0) return [];

        const customerIds = [...new Set(docs.map(d => d.customer).filter(Boolean))];
        let userMap: Record<string, string> = {};

        if (customerIds.length > 0) {
            const validObjectIds = customerIds.filter(id => mongoose.Types.ObjectId.isValid(id as string)) as string[];

            if (validObjectIds.length > 0) {
                const users = await UserModel.find({ _id: { $in: validObjectIds } }).select('_id companyName name').lean();
                userMap = users.reduce((acc, u) => {
                    acc[u._id.toString()] = u.companyName || u.name || "Unknown Customer";
                    return acc;
                }, {} as Record<string, string>);
            }
        }

        return docs.map(doc => this.toEntity(doc, userMap[doc.customer || ""]));
    }

    protected toEntity(c: IContainerDocument, customerName?: string): Container {
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
            customerName || c.customer, // Use ID as fallback if name not found
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
            c.cargoCategory,
            c.createdAt,
            c.updatedAt
        );
    }

    protected toModelData(container: Container): UpdateQuery<IContainerDocument> {
        const data: UpdateQuery<IContainerDocument> = {
            containerNumber: container.containerNumber,
            size: container.size,
            type: container.type,
            movementType: container.movementType,
            status: container.status,
            shippingLine: container.shippingLine,
            customer: container.customer,
            gateInTime: container.gateInTime,
            gateOutTime: container.gateOutTime,
            dwellTime: container.dwellTime,
            weight: container.weight,
            cargoWeight: container.cargoWeight,
            cargoDescription: container.cargoDescription,
            hazardousClassification: container.hazardousClassification,
            sealNumber: container.sealNumber,
            damaged: container.damaged,
            damageDetails: container.damageDetails,
            blacklisted: container.blacklisted,
            empty: container.empty,
            cargoCategory: container.cargoCategory,
        };

        if (container.yardLocation) {
            data.yardLocation = container.yardLocation;
        } else {
            data.$unset = { yardLocation: "" };
        }

        return data;
    }

    async countByStatus(status: string | string[], filter?: ContainerFilter): Promise<number> {
        const query: Record<string, unknown> = { ...filter };
        if (Array.isArray(status)) {
            query.status = { $in: status };
        } else {
            query.status = status;
        }
        return await this.model.countDocuments(query).exec();
    }

    async findInYard(filter?: ContainerFilter): Promise<Container[]> {
        const query: Record<string, unknown> = {
            ...filter,
            status: { $in: ["gate-in", "in-yard", "damaged"] },
            gateInTime: { $exists: true },
        };
        const docs = await this.model.find(query).exec();
        return this.mapWithCustomers(docs);
    }

    async getDistinctContainerNumbers(filter?: ContainerFilter): Promise<string[]> {
        return await this.model.find(filter).distinct("containerNumber").exec() as unknown as string[];
    }

    async getDistinctContainerIds(filter?: ContainerFilter): Promise<string[]> {
        return (await this.model.find(filter).distinct("_id").exec()).map(id => id.toString());
    }

    async findRecent(filter: ContainerFilter, limit: number): Promise<Container[]> {
        const docs = await this.model.find(filter as Record<string, unknown>).sort({ updatedAt: -1 as const }).limit(limit).exec();
        return this.mapWithCustomers(docs);
    }
}
