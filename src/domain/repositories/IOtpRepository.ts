export interface IOtpRepository {
    saveOtp(email: string, otp: string): Promise<void>;
    findOtp(email: string): Promise<{ otp: string; createdAt: Date } | null>;
    deleteOtp(email: string): Promise<void>;
}
