export type UserRole = "admin" | "operator" | "customer";
import { UserContextDto } from "./CommonDto";


export interface CreateUserRequestDto {
  email: string;
  role: UserRole;
  name?: string;
  userContext: UserContextDto;
}

export interface UpdateUserRequestDto {
  role?: UserRole;
  name?: string;
  phone?: string;
  companyName?: string;
  isBlocked?: boolean;
  userContext: UserContextDto;
}

export interface UpdateUserProfileRequestDto {
  name?: string;
  phone?: string;
  profileImage?: string;
  companyName?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  profileImage?: string;
  companyName?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCollectionResponseDto {
  items: UserResponseDto[];
  total: number;
}
