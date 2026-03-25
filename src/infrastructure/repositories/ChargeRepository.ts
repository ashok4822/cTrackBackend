import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { Charge } from "../../domain/entities/Charge";
import { ChargeModel, IChargeDocument } from "../models/ChargeModel";
import { Types } from "mongoose";

interface PopulatedField {
    _id: Types.ObjectId | string;
    name: string;
}

interface PopulatedChargeDoc extends Omit<IChargeDocument, 'activityId' | 'cargoCategoryId'> {
    _id: Types.ObjectId;
    activityId: string | PopulatedField;
    cargoCategoryId?: string | PopulatedField | null;
}

export class ChargeRepository implements IChargeRepository {
    async findAll(): Promise<Charge[]> {
        const docs = await ChargeModel.find()
            .populate("activityId", "name")
            .populate("cargoCategoryId", "name")
            .lean() as PopulatedChargeDoc[];
        return docs.map(doc => this.mapToEntity(doc));
    }

    async findById(id: string): Promise<Charge | null> {
        const doc = await ChargeModel.findById(id)
            .populate("activityId", "name")
            .populate("cargoCategoryId", "name")
            .lean() as PopulatedChargeDoc | null;
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByActivityId(activityId: string): Promise<Charge[]> {
        const docs = await ChargeModel.find({ activityId }).lean() as PopulatedChargeDoc[];
        return docs.map(doc => this.mapToEntity(doc));
    }

    async findByCriteria(activityId: string, containerSize: string, containerType: string, cargoCategoryId?: string): Promise<Charge | null> {
        const query: Record<string, string | null> = {
            activityId,
            containerSize,
            containerType,
            cargoCategoryId: cargoCategoryId || null
        };
        const doc = await ChargeModel.findOne(query).lean() as PopulatedChargeDoc | null;
        return doc ? this.mapToEntity(doc) : null;
    }

    async save(charge: Charge): Promise<Charge> {
        const doc = new ChargeModel(charge);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject() as PopulatedChargeDoc);
    }

    async update(id: string, charge: Partial<Charge>): Promise<Charge | null> {
        const doc = await ChargeModel.findByIdAndUpdate(id, charge, { new: true }).lean() as PopulatedChargeDoc | null;
        return doc ? this.mapToEntity(doc) : null;
    }

    private mapToEntity(doc: PopulatedChargeDoc): Charge {
        const { _id, activityId, cargoCategoryId, ...rest } = doc;

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
        } as Charge;

        if (activityId && typeof activityId === 'object' && 'name' in activityId) {
            entity.activityName = activityId.name;
        }

        if (cargoCategoryId && typeof cargoCategoryId === 'object' && cargoCategoryId !== null && 'name' in cargoCategoryId) {
            entity.cargoCategoryName = cargoCategoryId.name;
        }
        return entity;
    }
}
