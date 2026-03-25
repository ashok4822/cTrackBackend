import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { Activity } from "../../domain/entities/Activity";
import { ActivityModel, IActivityDocument } from "../models/ActivityModel";

export class ActivityRepository implements IActivityRepository {
  async findAll(): Promise<Activity[]> {
    const docs = await ActivityModel.find().lean();
    return docs.map((doc) =>
      this.mapToEntity(doc as unknown as IActivityDocument),
    );
  }

  async findById(id: string): Promise<Activity | null> {
    const doc = await ActivityModel.findById(id).lean();
    return doc ? this.mapToEntity(doc as unknown as IActivityDocument) : null;
  }

  async findByCode(code: string): Promise<Activity | null> {
    const doc = await ActivityModel.findOne({ code }).lean();
    return doc ? this.mapToEntity(doc as unknown as IActivityDocument) : null;
  }

  async save(activity: Activity): Promise<Activity> {
    const doc = new ActivityModel(activity);
    const saved = await doc.save();
    return this.mapToEntity(saved.toObject() as unknown as IActivityDocument);
  }

  async update(
    id: string,
    activity: Partial<Activity>,
  ): Promise<Activity | null> {
    const doc = await ActivityModel.findByIdAndUpdate(id, activity, {
      new: true,
    }).lean();
    return doc ? this.mapToEntity(doc as unknown as IActivityDocument) : null;
  }

  private mapToEntity(doc: IActivityDocument): Activity {
    const docObj = { ...(doc as unknown as Record<string, unknown>) };
    const id = (docObj._id as { toString(): string }).toString();

    delete docObj._id;
    delete docObj.__v;

    return {
      id,
      ...docObj,
    } as unknown as Activity;
  }
}
