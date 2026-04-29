"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeRepository = void 0;
const ChargeModel_1 = require("../models/ChargeModel");
class ChargeRepository {
    async findAll() {
        const docs = await ChargeModel_1.ChargeModel.find()
            .populate("activityId", "name")
            .populate("cargoCategoryId", "name")
            .lean();
        return docs.map(doc => this.mapToEntity(doc));
    }
    async findById(id) {
        const doc = await ChargeModel_1.ChargeModel.findById(id)
            .populate("activityId", "name")
            .populate("cargoCategoryId", "name")
            .lean();
        return doc ? this.mapToEntity(doc) : null;
    }
    async findByActivityId(activityId) {
        const docs = await ChargeModel_1.ChargeModel.find({ activityId }).lean();
        return docs.map(doc => this.mapToEntity(doc));
    }
    async findByCriteria(activityId, containerSize, containerType, cargoCategoryId) {
        const query = {
            activityId,
            containerSize,
            containerType,
            cargoCategoryId: cargoCategoryId || null
        };
        const doc = await ChargeModel_1.ChargeModel.findOne(query).lean();
        return doc ? this.mapToEntity(doc) : null;
    }
    async save(charge) {
        const doc = new ChargeModel_1.ChargeModel(charge);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject());
    }
    async update(id, charge) {
        const doc = await ChargeModel_1.ChargeModel.findByIdAndUpdate(id, charge, { new: true }).lean();
        return doc ? this.mapToEntity(doc) : null;
    }
    mapToEntity(doc) {
        const { _id, activityId, cargoCategoryId, ...rest } = doc;
        let actId = "";
        if (activityId) {
            if (typeof activityId === 'object' && activityId._id) {
                actId = activityId._id.toString();
            }
            else {
                actId = activityId.toString();
            }
        }
        let catId = undefined;
        if (cargoCategoryId) {
            if (typeof cargoCategoryId === 'object' && cargoCategoryId._id) {
                catId = cargoCategoryId._id.toString();
            }
            else {
                catId = cargoCategoryId.toString();
            }
        }
        const entity = {
            ...rest,
            activityId: actId,
            cargoCategoryId: catId
        };
        if (activityId && typeof activityId === 'object' && 'name' in activityId) {
            entity.activityName = activityId.name;
        }
        if (cargoCategoryId && typeof cargoCategoryId === 'object' && cargoCategoryId !== null && 'name' in cargoCategoryId) {
            entity.cargoCategoryName = cargoCategoryId.name;
        }
        return entity;
    }
}
exports.ChargeRepository = ChargeRepository;
//# sourceMappingURL=ChargeRepository.js.map