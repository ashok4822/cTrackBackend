import { User, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserModel, IUserDocument } from "../models/UserModel";
import { BaseRepository } from "./base/BaseRepository";

export class UserRepository extends BaseRepository<User, IUserDocument> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.model.findOne({ email }).exec();
    return userDoc ? this.toEntity(userDoc) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const userDoc = await this.model.findOne({ googleId }).exec();
    return userDoc ? this.toEntity(userDoc) : null;
  }

  async exists(email: string): Promise<boolean> {
    return super.exists({ email });
  }

  protected toEntity(userDoc: IUserDocument): User {
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
      userDoc.isBlocked,
      userDoc.createdAt,
      userDoc.updatedAt
    );
  }

  protected toModelData(user: User): any {
    return {
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
  }
}
