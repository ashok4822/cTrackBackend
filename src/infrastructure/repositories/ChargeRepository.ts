import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { Charge } from "../../domain/entities/Charge";
import { ChargeModel } from "../models/ChargeModel";

export class ChargeRepository implements IChargeRepository {
    async findAll(): Promise<Charge[]> {
        const docs = await ChargeModel.find()
            .populate("activityId", "name")
            .populate("cargoCategoryId", "name")
            .lean();
        return docs.map(this.mapToEntity);
    }

    async findById(id: string): Promise<Charge | null> {
        const doc = await ChargeModel.findById(id)
            .populate("activityId", "name")
            .populate("cargoCategoryId", "name")
            .lean();
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByActivityId(activityId: string): Promise<Charge[]> {
        const docs = await ChargeModel.find({ activityId }).lean();
        return docs.map(this.mapToEntity);
    }

    async findByCriteria(activityId: string, containerSize: string, containerType: string, cargoCategoryId?: string): Promise<Charge | null> {
        const query: any = {
            activityId,
            containerSize,
            containerType,
            cargoCategoryId: cargoCategoryId || null
        };
        const doc = await ChargeModel.findOne(query).lean();
        return doc ? this.mapToEntity(doc) : null;
    }

    async save(charge: Charge): Promise<Charge> {
        const doc = new ChargeModel(charge);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject());
    }

    async update(id: string, charge: Partial<Charge>): Promise<Charge | null> {
        const doc = await ChargeModel.findByIdAndUpdate(id, charge, { new: true }).lean();
        return doc ? this.mapToEntity(doc) : null;
    }

    private mapToEntity(doc: any): Charge {
        const { _id, __v, activityId, cargoCategoryId, ...rest } = doc;

        let actId = "";
        if (activityId) {
            if (typeof activityId === 'object' && activityId._id) {
                actId = activityId._id.toString();
            } else {
                actId = activityId.toString();
            }
        }

        let catId = undefined;
        if (cargoCategoryId) {
            if (typeof cargoCategoryId === 'object' && cargoCategoryId._id) {
                catId = cargoCategoryId._id.toString();
            } else {
                catId = cargoCategoryId.toString();
            }
        }

        const entity: Charge = {
            id: _id.toString(),
            activityId: actId,
            cargoCategoryId: catId,
            ...rest
        };

        if (activityId && typeof activityId === 'object' && activityId.name) {
            entity.activityName = activityId.name;
        }

        if (cargoCategoryId && typeof cargoCategoryId === 'object' && cargoCategoryId.name) {
            entity.cargoCategoryName = cargoCategoryId.name;
        }
        return entity;
    }
}
