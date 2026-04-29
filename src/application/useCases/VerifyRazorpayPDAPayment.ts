import { IVerifyRazorpayPDAPayment } from "../ports/IVerifyRazorpayPDAPayment";
import { IPaymentService } from "../services/IPaymentService";
import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { PDATransactionResponseDto } from "../dto/PDADto";
import { PDAMapper } from "../mappers/PDAMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class VerifyRazorpayPDAPayment implements IVerifyRazorpayPDAPayment {
    constructor(
        private pdaRepository: IPDARepository,
        private paymentService: IPaymentService
    ) { }

    async execute(
        userId: string,
        amount: number,
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string
    ): Promise<PDATransactionResponseDto> {
        // Verify signature
        const isValid = this.paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            throw new AppError(ResponseMessage.INVALID_PAYMENT_SIGNATURE, HttpStatus.BAD_REQUEST);
        }

        const pda = await this.pdaRepository.findByUserId(userId);
        if (!pda) throw new AppError(ResponseMessage.PDA_NOT_FOUND, HttpStatus.NOT_FOUND);

        const newBalance = pda.balance + amount;

        const transaction = await this.pdaRepository.createTransaction({
            pdaId: pda.id,
            type: "credit",
            amount,
            description: `${ResponseMessage.ACTION_RAZORPAY_DEPOSIT} (${razorpay_payment_id})`,
            balanceAfter: newBalance,
            timestamp: new Date()
        });

        await this.pdaRepository.updateBalance(pda.id, newBalance);

        return PDAMapper.toTransactionResponseDto(transaction);
    }
}

