import { Request, Response } from "express";
import { GetPDA } from "../../application/useCases/GetPDA";
import { CreateRazorpayPDAOrder } from "../../application/useCases/CreateRazorpayPDAOrder";
import { VerifyRazorpayPDAPayment } from "../../application/useCases/VerifyRazorpayPDAPayment";

export class PDAController {
    constructor(
        private getPDAUseCase: GetPDA,
        private createRazorpayPDAOrderUseCase: CreateRazorpayPDAOrder,
        private verifyRazorpayPDAPaymentUseCase: VerifyRazorpayPDAPayment
    ) { }

    async getPDA(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized: No user session found" });
                return;
            }
            const { id: userId, role } = req.user;
            const result = await this.getPDAUseCase.execute(userId, role);
            res.status(200).json(result);
        } catch (error: unknown) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }

    async createRazorpayOrder(req: Request, res: Response): Promise<void> {
        try {

            if (!req.user) {
                console.error("PDAController: No user in request");
                res.status(401).json({ message: "Unauthorized: No user session found" });
                return;
            }

            const { id: userId } = req.user;
            const { amount } = req.body;
            const result = await this.createRazorpayPDAOrderUseCase.execute(amount, userId);
            res.status(200).json(result);
        } catch (error: unknown) {
            console.error("PDAController: createRazorpayOrder Error:", error);
            res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }

    async verifyRazorpayPayment(req: Request, res: Response): Promise<void> {
        try {

            if (!req.user) {
                console.error("PDAController: No user in request for verification");
                res.status(401).json({ message: "Unauthorized: No user session found" });
                return;
            }

            const { id: userId } = req.user;
            const { amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const result = await this.verifyRazorpayPDAPaymentUseCase.execute(
                userId,
                amount,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );
            res.status(200).json(result);
        } catch (error: unknown) {
            console.error("PDAController: verifyRazorpayPayment Error:", error);
            res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }
}
