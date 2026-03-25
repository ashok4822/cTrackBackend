import Razorpay from "razorpay";
import { Orders } from "razorpay/dist/types/orders";

export class CreateRazorpayPDAOrder {
    private razorpay: Razorpay;

    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZOR_KEY_ID || "",
            key_secret: process.env.RAZOR_SECRET_ID || "",
        });
    }

    async execute(amount: number, userId: string): Promise<Orders.RazorpayOrder> {
        if (!amount || isNaN(amount) || amount <= 0) {
            throw new Error(`Invalid amount: ${amount}`);
        }

        const key_id = process.env.RAZOR_KEY_ID;
        const key_secret = process.env.RAZOR_SECRET_ID;

        if (!key_id || !key_secret) {
            console.error("Razorpay Credentials Missing: RAZOR_KEY_ID or RAZOR_SECRET_ID");
            throw new Error("Razorpay configuration error");
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: "INR",
            receipt: `pda_${userId.substring(userId.length - 10)}_${Date.now()}`,
        };

        try {
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error: unknown) {
            console.error("[PDA] Razorpay Order Creation Error (Full):", error);
            
            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'error' in error) {
                // Razorpay sometimes returns error object with details
                const razorpayError = (error as { error: { description?: string } }).error;
                console.error("[PDA] Razorpay API Error Details:", JSON.stringify(razorpayError, null, 2));
                errorMessage = razorpayError.description || errorMessage;
            }

            
            throw new Error(`Razorpay PDA Order Creation Failed: ${errorMessage}`, { cause: error });
        }

    }
}

