"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    _transporter;
    constructor() {
        this._transporter = nodemailer_1.default.createTransport({
            service: "gmail", // Or use host/port for other providers
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    async sendOtp(email, otp) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for cTrack Signup",
            text: `Your OTP is ${otp}. It is valid for 1 minute.`,
            html: `<p>Your OTP is <b>${otp}</b>. It is valid for 1 minute.</p>`,
        };
        await this._transporter.sendMail(mailOptions);
    }
    async sendPasswordResetOtp(email, otp) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password - cTrack",
            text: `Your OTP for password reset is ${otp}. It is valid for 1 minute.`,
            html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 1 minute.</p>`,
        };
        await this._transporter.sendMail(mailOptions);
    }
    async sendWelcomeEmail(email, password, name) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to cTrack - Your Account Details",
            text: `Hello ${name || 'User'},\n\nYour account has been created successfully. Your login credentials are:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password for security.`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Welcome to cTrack!</h2>
                    <p>Hello ${name || 'User'},</p>
                    <p>Your account has been created successfully. Below are your login credentials:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 0;"><strong>Password:</strong> ${password}</p>
                    </div>
                    <p>For security reasons, we recommend that you log in and change your password immediately.</p>
                    <p>Best Regards,<br>The cTrack Team</p>
                </div>
            `,
        };
        await this._transporter.sendMail(mailOptions);
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map