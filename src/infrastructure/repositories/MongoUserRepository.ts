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
      userDoc.role as UserRole,
      userDoc.password,
      userDoc.name,
      userDoc.phone,
      userDoc.googleId,
      userDoc.profileImage,
      userDoc.companyName,
    );
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;

    return new User(
      userDoc._id.toString(),
      userDoc.email,
      userDoc.role as UserRole,
      userDoc.password,
      userDoc.name,
      userDoc.phone,
      userDoc.googleId,
      userDoc.profileImage,
      userDoc.companyName,
    );
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ googleId });
    if (!userDoc) return null;

    return new User(
      userDoc._id.toString(),
      userDoc.email,
      userDoc.role as UserRole,
      userDoc.password,
      userDoc.name,
      userDoc.phone,
      userDoc.googleId,
      userDoc.profileImage,
      userDoc.companyName,
    );
  }

  async save(user: User): Promise<void> {
    const userData = {
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name,
      phone: user.phone,
      googleId: user.googleId,
      profileImage: user.profileImage,
      companyName: user.companyName,
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
