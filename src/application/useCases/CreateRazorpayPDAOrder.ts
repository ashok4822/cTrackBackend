import Razorpay from "razorpay";

export class CreateRazorpayPDAOrder {
    private razorpay: Razorpay;

    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZOR_KEY_ID || "",
            key_secret: process.env.RAZOR_SECRET_ID || "",
        });
    }

    async execute(amount: number, userId: string): Promise<any> {
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
            console.log(`[PDA] Creating Razorpay Order for User: ${userId}, Amount: ${amount}`);
            const order = await this.razorpay.orders.create(options);
            console.log(`[PDA] Razorpay Order Created Success: ${order.id}`);
            return order;
        } catch (error: any) {
            console.error("[PDA] Razorpay Order Creation Error (Full):", error);
            if (error.error) {
                console.error("[PDA] Razorpay API Error Details:", JSON.stringify(error.error, null, 2));
            }
            throw new Error(`Razorpay PDA Order Creation Failed: ${error.message || 'Unknown error'}`);
        }
    }
}
