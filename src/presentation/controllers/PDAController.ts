import { Request, Response } from "express";
import { IGetPDA } from "../../application/ports/IGetPDA";
import { ICreateRazorpayPDAOrder } from "../../application/ports/ICreateRazorpayPDAOrder";
import { IVerifyRazorpayPDAPayment } from "../../application/ports/IVerifyRazorpayPDAPayment";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AppError } from "../../domain/exceptions/AppError";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class PDAController {
    constructor(
        private getPDAUseCase: IGetPDA,
        private createRazorpayPDAOrderUseCase: ICreateRazorpayPDAOrder,
        private verifyRazorpayPDAPaymentUseCase: IVerifyRazorpayPDAPayment
    ) { }

    getPDA = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        const { id: userId, role } = req.user;
        const result = await this.getPDAUseCase.execute(userId, role);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    });

    createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const { id: userId } = req.user;
        const { amount } = req.body;
        const result = await this.createRazorpayPDAOrderUseCase.execute(amount, userId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    });

    verifyRazorpayPayment = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
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
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    });
}


