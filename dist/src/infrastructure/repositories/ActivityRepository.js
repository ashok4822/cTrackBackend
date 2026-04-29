"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepository = void 0;
const ActivityModel_1 = require("../models/ActivityModel");
class ActivityRepository {
    async findAll() {
        const docs = await ActivityModel_1.ActivityModel.find().lean();
        return docs.map((doc) => this.mapToEntity(doc));
    }
    async findById(id) {
        const doc = await ActivityModel_1.ActivityModel.findById(id).lean();
        return doc ? this.mapToEntity(doc) : null;
    }
    async findByCode(code) {
        const doc = await ActivityModel_1.ActivityModel.findOne({ code }).lean();
        return doc ? this.mapToEntity(doc) : null;
    }
    async save(activity) {
        const doc = new ActivityModel_1.ActivityModel(activity);
        const saved = await doc.save();
        return this.mapToEntity(saved.toObject());
    }
    async update(id, activity) {
        const doc = await ActivityModel_1.ActivityModel.findByIdAndUpdate(id, activity, {
            new: true,
        }).lean();
        return doc ? this.mapToEntity(doc) : null;
    }
    mapToEntity(doc) {
        const docObj = { ...doc };
        const id = docObj._id.toString();
        delete docObj._id;
        delete docObj.__v;
        return {
            id,
            ...docObj,
        };
    }
}
exports.ActivityRepository = ActivityRepository;
//# sourceMappingURL=ActivityRepository.js.map