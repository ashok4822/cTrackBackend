export type UserRole = "admin" | "operator" | "customer";
import { UserContextDto } from "./CommonDto";


export class CreateUserRequestDto {
  email!: string;
  role!: UserRole;
  name?: string;
  userContext!: UserContextDto;
}

export class UpdateUserRequestDto {
  role?: UserRole;
  name?: string;
  phone?: string;
  companyName?: string;
  isBlocked?: boolean;
  userContext!: UserContextDto;
}

export class UpdateUserProfileRequestDto {
  name?: string;
  phone?: string;
  profileImage?: string;
  companyName?: string;
}

export class UserResponseDto {
  id!: string;
  email!: string;
  role!: UserRole;
  name?: string;
  phone?: string;
  profileImage?: string;
  companyName?: string;
  isBlocked!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserCollectionResponseDto {
  items!: UserResponseDto[];
  total!: number;
}
