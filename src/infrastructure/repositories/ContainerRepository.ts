import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { Container } from "../../domain/entities/Container";
import { ContainerModel, IContainerDocument } from "../models/ContainerModel";
import { BaseRepository } from "./base/BaseRepository";
import { UserModel } from "../models/UserModel";
import mongoose from "mongoose";

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

    async findAll(filters?: {
        containerNumber?: string;
        size?: string;
        type?: string;
        block?: string;
        status?: string | string[];
        customer?: string;
        empty?: boolean;
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
            cargoCategory: container.cargoCategory,
        };
    }
}
