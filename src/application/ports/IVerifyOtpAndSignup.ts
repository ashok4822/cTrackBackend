import { VerifyOtpAndSignupRequestDto } from "../dto/AuthDto";

export interface IVerifyOtpAndSignup {
  execute(request: VerifyOtpAndSignupRequestDto): Promise<void>;
}
