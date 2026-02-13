import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserModel } from "../models/UserModel";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });

    if (!userDoc) return null;

    return new User(
      userDoc._id.toString(),
      userDoc.email,
      userDoc.password,
      userDoc.role as UserRole,
      userDoc.name,
    );
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;

    return new User(
      userDoc._id.toString(),
      userDoc.email,
      userDoc.password,
      userDoc.role as UserRole,
      userDoc.name,
    );
  }

  async save(user: User): Promise<void> {
    const userData = {
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name,
    };

    if (user.id) {
      await UserModel.findByIdAndUpdate(user.id, userData, { upsert: true });
    } else {
      await UserModel.create(userData);
    }
  }

  async exists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }
}
