import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { Activity } from "../../domain/entities/Activity";
import { ActivityModel } from "../models/ActivityModel";

export class ActivityRepository implements IActivityRepository {
    async findAll(): Promise<Activity[]> {
        const docs = await ActivityModel.find().lean();
        return docs.map(this.mapToEntity);
    }

    async findById(id: string): Promise<Activity | null> {
        const doc = await ActivityModel.findById(id).lean();
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByCode(code: string): Promise<Activity | null> {
        const doc = await ActivityModel.findOne({ code }).lean();
        return doc ? this.mapToEntity(doc) : null;
    }

    async save(activity: Activity): Promise<Activity> {
        const doc = new ActivityModel(activity);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject());
    }

    async update(id: string, activity: Partial<Activity>): Promise<Activity | null> {
        const doc = await ActivityModel.findByIdAndUpdate(id, activity, { new: true }).lean();
        return doc ? this.mapToEntity(doc) : null;
    }

    private mapToEntity(doc: any): Activity {
        const { _id, __v, ...rest } = doc;
        return { id: _id.toString(), ...rest };
    }
}
