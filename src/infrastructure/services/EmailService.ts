import nodemailer from "nodemailer";
import { IEmailService } from "../../application/services/IEmailService";

export class EmailService implements IEmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail", // Or use host/port for other providers
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendOtp(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for cTrack Signup",
            text: `Your OTP is ${otp}. It is valid for 1 minute.`,
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 1 minute.</p>`,
        };

        await this.transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    }

    async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password - cTrack",
            text: `Your OTP for password reset is ${otp}. It is valid for 1 minute.`,
            html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 1 minute.</p>`,
        };

        await this.transporter.sendMail(mailOptions);
        console.log(`Password reset OTP sent to ${email}`);
    }
}
