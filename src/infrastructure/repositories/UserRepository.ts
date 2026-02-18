import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserModel } from "../models/UserModel";

export class UserRepository implements IUserRepository {
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
      userDoc.isBlocked
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
      userDoc.isBlocked
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
      userDoc.isBlocked
    );
  }

  async save(user: User): Promise<User> {
    const userData = {
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name,
      phone: user.phone,
      googleId: user.googleId,
      profileImage: user.profileImage,
      companyName: user.companyName,
      isBlocked: user.isBlocked,
    };

    let savedDoc;
    if (user.id) {
      savedDoc = await UserModel.findByIdAndUpdate(user.id, userData, { new: true, upsert: true });
    } else {
      savedDoc = await UserModel.create(userData);
    }

    return new User(
      savedDoc!._id.toString(),
      savedDoc!.email,
      savedDoc!.role as UserRole,
      savedDoc!.password,
      savedDoc!.name,
      savedDoc!.phone,
      savedDoc!.googleId,
      savedDoc!.profileImage,
      savedDoc!.companyName,
      savedDoc!.isBlocked,
      savedDoc!.createdAt,
      savedDoc!.updatedAt
    );
  }

  async findAll(): Promise<User[]> {
    const userDocs = await UserModel.find();
    return userDocs.map(
      (userDoc) =>
        new User(
          userDoc._id.toString(),
          userDoc.email,
          userDoc.role as UserRole,
          userDoc.password,
          userDoc.name,
          userDoc.phone,
          userDoc.googleId,
          userDoc.profileImage,
          userDoc.companyName,
          userDoc.isBlocked,
          userDoc.createdAt,
          userDoc.updatedAt
        )
    );
  }

  async exists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }
}
