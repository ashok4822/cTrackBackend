
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { OtpModel } from "./src/infrastructure/models/OtpModel";
import { OtpRepository } from "./src/infrastructure/repositories/OtpRepository";
import { VerifyOtpAndSignup } from "./src/application/useCases/VerifyOtpAndSignup";
import { IUserRepository } from "./src/domain/repositories/IUserRepository";
import { IHashService } from "./src/application/services/IHashService";
import { User } from "./src/domain/entities/User";

// Load env
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Mocks
class MockHashService implements IHashService {
    async hash(data: string): Promise<string> {
        return "hashed_" + data;
    }
    async compare(data: string, encrypted: string): Promise<boolean> {
        return true;
    }
}

class MockUserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return null;
    }
    async findById(id: string): Promise<User | null> {
        return null;
    }
    async findByGoogleId(googleId: string): Promise<User | null> {
        return null;
    }
    async save(user: User): Promise<void> {
        console.log("Mock User Saved:", user.email);
    }
    async exists(email: string): Promise<boolean> {
        return false;
    }
}

async function main() {
    const uri = process.env.MONGODB_LOCAL || process.env.MONGODB_URI;
    if (!uri) {
        console.error("No MongoDB URI found");
        return;
    }

    try {
        console.log(`Connecting to MongoDB...`);
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for testing");

        const email = "test_expire@example.com";
        const otpCode = "123456";

        // 1. Clear existing OTP for this email
        await OtpModel.deleteMany({ email });

        // 2. Create an EXPIRED OTP (65 seconds ago)
        const pastDate = new Date(Date.now() - 65 * 1000); // 65 seconds ago
        await OtpModel.create({
            email,
            otp: otpCode,
            createdAt: pastDate,
        });
        console.log(`Created dummy expired OTP for ${email}, createdAt: ${pastDate.toISOString()}`);

        // 3. Setup Use Case
        const otpRepo = new OtpRepository();
        const mockUserRepo = new MockUserRepository();
        const mockHashService = new MockHashService();
        const verifyUseCase = new VerifyOtpAndSignup(
            mockUserRepo,
            otpRepo,
            mockHashService
        );

        // 4. Execute Verification
        console.log("Attempting to verify expired OTP...");
        try {
            await verifyUseCase.execute(email, otpCode, "password123", "Test User");
            console.error("FAILURE: Verification succeeded but should have failed!");
        } catch (error: any) {
            if (error.message === "OTP has expired") {
                console.log("SUCCESS: Caught expected error 'OTP has expired'");
            } else {
                console.error("FAILURE: Caught unexpected error:", error.message);
            }
        }

        // Cleanup
        await OtpModel.deleteMany({ email });

    } catch (error) {
        console.error("Test Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
