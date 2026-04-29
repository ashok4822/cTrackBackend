"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoCategoryRepository = void 0;
const CargoCategory_1 = require("../../domain/entities/CargoCategory");
const CargoCategoryModel_1 = require("../models/CargoCategoryModel");
class CargoCategoryRepository {
    async findAll() {
        const docs = await CargoCategoryModel_1.CargoCategoryModel.find().lean();
        return docs.map(this.mapToEntity);
    }
    async findById(id) {
        const doc = await CargoCategoryModel_1.CargoCategoryModel.findById(id).lean();
        return doc ? this.mapToEntity(doc) : null;
    }
    async save(category) {
        const doc = new CargoCategoryModel_1.CargoCategoryModel(category);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject());
    }
    async update(id, category) {
        const doc = await CargoCategoryModel_1.CargoCategoryModel.findByIdAndUpdate(id, category, { new: true }).lean();
        return doc ? this.mapToEntity(doc) : null;
    }
    mapToEntity(doc) {
        const { _id, ...rest } = doc;
        return new CargoCategory_1.CargoCategory(_id.toString(), rest.name, rest.description, rest.active, rest.chargePerTon);
    }
}
exports.CargoCategoryRepository = CargoCategoryRepository;
//# sourceMappingURL=CargoCategoryRepository.js.map