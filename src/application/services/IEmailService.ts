export interface IEmailService {
    sendOtp(email: string, otp: string): Promise<void>;
    sendPasswordResetOtp(email: string, otp: string): Promise<void>;
    sendWelcomeEmail(email: string, password: string, name?: string): Promise<void>;
}
