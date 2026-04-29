"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const ResponseMessage_1 = require("../../../shared/constants/ResponseMessage");
/*
  Abstract Base Repository to provide common database operations.
   TEntity - The Domain Entity type
   TModel - The Mongoose Document type
*/
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    // Find a single entity by its ID.
    async findById(id) {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        const doc = await this.model.findById(id).exec();
        return doc ? this.toEntity(doc) : null;
    }
    // Find all entities.
    async findAll() {
        const docs = await this.model.find().exec();
        return docs.map((doc) => this.toEntity(doc));
    }
    // Check if a document exists based on a query.
    async exists(query) {
        const count = await this.model.countDocuments(query).exec();
        return count > 0;
    }
    // Save (Create or Update) an entity.
    async save(entity) {
        const data = this.toModelData(entity);
        const id = entity.id;
        let savedDoc;
        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            savedDoc = await this.model
                .findByIdAndUpdate(id, data, { new: true })
                .exec();
            if (!savedDoc)
                throw new Error(ResponseMessage_1.ResponseMessage.ENTITY_NOT_FOUND_UPDATE);
        }
        else {
            savedDoc = await this.model.create(data);
        }
        return this.toEntity(savedDoc);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map