import crypto from "crypto";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { Bill } from "../../domain/entities/Bill";
import { NotificationModel } from "../../infrastructure/models/NotificationModel";
import { socketService } from "../../infrastructure/services/socketService";

export class VerifyRazorpayPayment {
    constructor(private billRepository: IBillRepository) { }

    async execute(
        billId: string,
        userId: string,
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string
    ): Promise<Bill> {
        const bill = await this.billRepository.findById(billId);

        if (!bill) {
            throw new Error("Bill not found");
        }

        if (!bill.customer || bill.customer.toString() !== userId) {
            throw new Error("Unauthorized: This bill does not belong to you");
        }

        // Verify signature
        const secret = process.env.RAZOR_SECRET_ID || "";
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature !== razorpay_signature) {
            throw new Error("Invalid payment signature");
        }

        // Update bill status
        const updatedBill = await this.billRepository.update(billId, {
            status: "paid",
            paymentDetails: {
                method: "online",
                transactionId: razorpay_payment_id,
                orderId: razorpay_order_id,
                paidAt: new Date()
            },
            paidAt: new Date()
        } as any);

        if (!updatedBill) {
            throw new Error("Failed to update bill status");
        }

        // Notify customer about successful payment
        try {
            const notification = await NotificationModel.create({
                userId: userId,
                type: "success",
                title: "Payment Successful",
                message: `Your payment of ₹${updatedBill.totalAmount} for bill ${updatedBill.billNumber} has been received.`,
                link: "/customer/bills"
            });
            socketService.emitNotification(notification, userId);
        } catch (err) {
            console.error("Failed to create/emit notification for payment success:", err);
        }

        return updatedBill;
    }
}
