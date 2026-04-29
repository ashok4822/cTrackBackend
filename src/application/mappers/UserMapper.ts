import { User, UserRole } from "../../domain/entities/User";
import { 
  UserResponseDto, 
  UserCollectionResponseDto 
} from "../dto/UserDto";

export class UserMapper {
  /** Create a brand-new User entity for registration / admin creation flows */
  static createNew(
    email: string,
    role: UserRole,
    hashedPassword: string,
    name?: string
  ): User {
    return new User("", email, role, hashedPassword, name, undefined, undefined, undefined);
  }

  /** Create a new User entity from a Google OAuth profile */
  static createFromGoogle(
    email: string,
    googleId: string,
    name?: string,
    profileImage?: string
  ): User {
    return new User("", email, "customer", undefined, name, undefined, googleId, profileImage);
  }

  /** Link an existing User entity to a Google account */
  static linkGoogle(
    user: User,
    googleId: string,
    name?: string,
    profileImage?: string
  ): User {
    return new User(
      user.id,
      user.email,
      user.role,
      user.password,
      (user.name || name) as string | undefined,
      user.phone,
      googleId,
      user.profileImage || profileImage
    );
  }

  /** Apply an admin-initiated update to an existing User entity */
  static applyAdminUpdate(
    user: User,
    data: {
      role?: UserRole;
      name?: string;
      phone?: string;
      companyName?: string;
      isBlocked?: boolean;
    }
  ): User {
    return new User(
      user.id,
      user.email,
      data.role !== undefined ? data.role : user.role,
      user.password,
      data.name !== undefined ? data.name : user.name,
      data.phone !== undefined ? data.phone : user.phone,
      user.googleId,
      user.profileImage,
      data.companyName !== undefined ? data.companyName : user.companyName,
      data.isBlocked !== undefined ? data.isBlocked : user.isBlocked
    );
  }

  /** Toggle the isBlocked flag on an existing User entity */
  static applyBlockToggle(user: User): User {
    return new User(
      user.id,
      user.email,
      user.role,
      user.password,
      user.name,
      user.phone,
      user.googleId,
      user.profileImage,
      user.companyName,
      !user.isBlocked
    );
  }

  static toResponseDto(entity: User): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      role: entity.role,
      name: entity.name,
      phone: entity.phone,
      profileImage: entity.profileImage,
      companyName: entity.companyName,
      isBlocked: entity.isBlocked,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toCollectionResponseDto(entities: User[]): UserCollectionResponseDto {
    return {
      items: entities.map(user => this.toResponseDto(user)),
      total: entities.length,
    };
  }
}
