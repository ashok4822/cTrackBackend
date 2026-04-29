import { LoginRequestDto, LoginResponseDto } from "../dto/AuthDto";

export interface ILogin {
  execute(request: LoginRequestDto): Promise<LoginResponseDto>;
}
