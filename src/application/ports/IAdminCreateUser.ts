import { CreateUserRequestDto, UserResponseDto } from "../dto/UserDto";
// Re-export for backward compatibility – prefer importing UserContextDto from CommonDto directly
export { UserContextDto as UserContext } from "../dto/CommonDto";

export interface IAdminCreateUser {
  execute(data: CreateUserRequestDto): Promise<UserResponseDto>;
}
