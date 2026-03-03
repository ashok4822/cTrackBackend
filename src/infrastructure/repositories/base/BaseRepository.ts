import { Model, Document } from "mongoose";

/**
  Abstract Base Repository to provide common database operations.
   TEntity - The Domain Entity type
   TModel - The Mongoose Document type
*/
export abstract class BaseRepository<TEntity, TModel extends Document> {
  constructor(protected readonly model: Model<TModel>) {}

  // Find a single entity by its ID.
  async findById(id: string): Promise<TEntity | null> {
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return null;

    const doc = await this.model.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  // Find all entities.
  async findAll(): Promise<TEntity[]> {
    const docs = await this.model.find().exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  // Check if a document exists based on a query.
  async exists(query: any): Promise<boolean> {
    const count = await this.model.countDocuments(query).exec();
    return count > 0;
  }

  // Save (Create or Update) an entity.
  async save(entity: TEntity): Promise<TEntity> {
    const data = this.toModelData(entity);
    const id = (entity as any).id;

    let savedDoc;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      savedDoc = await this.model
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
      if (!savedDoc) throw new Error("Entity not found for update");
    } else {
      savedDoc = await this.model.create(data);
    }

    return this.toEntity(savedDoc);
  }

  // Abstract method to map Mongoose Document to Domain Entity.
  protected abstract toEntity(doc: TModel): TEntity;

  // Abstract method to map Domain Entity to Mongoose Data object.
  protected abstract toModelData(entity: TEntity): any;
}
