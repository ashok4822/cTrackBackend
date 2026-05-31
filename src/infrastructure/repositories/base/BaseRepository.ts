import { Model, Document, UpdateQuery } from "mongoose";
import { ResponseMessage } from "../../../shared/constants/ResponseMessage";

/*
  Abstract Base Repository to provide common database operations.
   TEntity - The Domain Entity type
   TModel - The Mongoose Document type
*/
export abstract class BaseRepository<TEntity, TModel extends Document> {
  constructor(protected readonly _model: Model<TModel>) { }

  // Find a single entity by its ID.
  async findById(id: string): Promise<TEntity | null> {
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return null;

    const doc = await this._model.findById(id).exec();
    return doc ? this._toEntity(doc) : null;
  }

  // Find all entities.
  async findAll(): Promise<TEntity[]> {
    const docs = await this._model.find().exec();
    return docs.map((doc) => this._toEntity(doc));
  }

  // Check if a document exists based on a query.
  async exists(query: UpdateQuery<TModel>): Promise<boolean> {
    const count = await this._model.countDocuments(query).exec();
    return count > 0;
  }

  // Save (Create or Update) an entity.
  async save(entity: TEntity): Promise<TEntity> {
    const data = this._toModelData(entity);
    const id = (entity as { id?: string | null }).id;

    let savedDoc;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      savedDoc = await this._model
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
      if (!savedDoc) throw new Error(ResponseMessage.ENTITY_NOT_FOUND_UPDATE);
    } else {
      savedDoc = await this._model.create(data);
    }

    return this._toEntity(savedDoc);
  }

  // Abstract method to map Mongoose Document to Domain Entity.
  protected abstract _toEntity(doc: TModel): TEntity;

  // Abstract method to map Domain Entity to Mongoose Data object.
  protected abstract _toModelData(entity: TEntity): UpdateQuery<TModel>;
}
