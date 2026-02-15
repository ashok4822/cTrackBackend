
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load env from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function main() {
    console.log("User:", process.env.EMAIL_USER);
    // Mask password for security in logs
    console.log("Pass provided:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        // verify connection configuration
        await transporter.verify();
        console.log("Server is ready to take our messages");
    } catch (error) {
        console.error("Verification error:", error);
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to self
        subject: "Test Email",
        text: "This is a test email.",
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Send error:", error);
    }
}

main();
