import mongoose from "mongoose";
import { IIdValidator } from "../../domain/services/IIdValidator";

export class MongooseIdValidator implements IIdValidator {
  isValid(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
