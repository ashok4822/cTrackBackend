export interface IResetPassword {
  execute(email: string, otp: string, newPassword: string): Promise<void>;
}
