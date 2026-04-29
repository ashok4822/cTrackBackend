import { ICreateRazorpayPDAOrder } from "../ports/ICreateRazorpayPDAOrder";
import { IPaymentService, PaymentOrder } from "../services/IPaymentService";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateRazorpayPDAOrder implements ICreateRazorpayPDAOrder {
    constructor(private paymentService: IPaymentService) { }

    async execute(amount: number, userId: string): Promise<PaymentOrder> {
        if (!amount || isNaN(amount) || amount <= 0) {
            throw new AppError(`${ResponseMessage.INVALID_AMOUNT}: ${amount}`, HttpStatus.BAD_REQUEST);
        }

        const receipt = `pda_${userId.substring(userId.length - 10)}_${Date.now()}`;

        try {
            const order = await this.paymentService.createOrder(amount, receipt);
            return order;
        } catch (error: unknown) {
            console.error("[PDA] Razorpay Order Creation Error:", error);
            
            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            throw new AppError(`${ResponseMessage.PDA_ORDER_FAILED}: ${errorMessage}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

