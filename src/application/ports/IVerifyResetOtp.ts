export interface IVerifyResetOtp {
  execute(email: string, otp: string): Promise<void>;
}
