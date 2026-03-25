import { ICargoCategoryRepository } from "../../domain/repositories/ICargoCategoryRepository";
import { CargoCategory } from "../../domain/entities/CargoCategory";
import { CargoCategoryModel, ICargoCategoryDocument } from "../models/CargoCategoryModel";

export class CargoCategoryRepository implements ICargoCategoryRepository {
    async findAll(): Promise<CargoCategory[]> {
        const docs = await CargoCategoryModel.find().lean();
        return (docs as unknown as ICargoCategoryDocument[]).map(this.mapToEntity);
    }

    async findById(id: string): Promise<CargoCategory | null> {
        const doc = await CargoCategoryModel.findById(id).lean();
        return doc ? this.mapToEntity(doc as unknown as ICargoCategoryDocument) : null;
    }

    async save(category: CargoCategory): Promise<CargoCategory> {
        const doc = new CargoCategoryModel(category);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject());
    }

    async update(id: string, category: Partial<CargoCategory>): Promise<CargoCategory | null> {
        const doc = await CargoCategoryModel.findByIdAndUpdate(id, category, { new: true }).lean();
        return doc ? this.mapToEntity(doc as unknown as ICargoCategoryDocument) : null;
    }

    private mapToEntity(doc: ICargoCategoryDocument): CargoCategory {
        const { _id, ...rest } = doc;
        return new CargoCategory(
            _id.toString(),
            rest.name,
            rest.description,
            rest.active,
            rest.chargePerTon
        );
    }
}
