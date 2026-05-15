import { Request, Response } from "express";
import { IGetBills } from "../../application/ports/IGetBills";
import { IMarkBillPaid } from "../../application/ports/IMarkBillPaid";
import { ICreateBill } from "../../application/ports/ICreateBill";
import { IPayBillWithPDA } from "../../application/ports/IPayBillWithPDA";
import { IGetBillById } from "../../application/ports/IGetBillById";
import { ICreateRazorpayOrder } from "../../application/ports/ICreateRazorpayOrder";
import { IVerifyRazorpayPayment } from "../../application/ports/IVerifyRazorpayPayment";
import { IGetBillTransactions } from "../../application/ports/IGetBillTransactions";
import { IGetOverdueStatus } from "../../application/ports/IGetOverdueStatus";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AppError } from "../../domain/exceptions/AppError";
import { extractUserContext } from "../utils/userContext";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class BillingController {
  constructor(
    private getBillsUseCase: IGetBills,
    private markBillPaidUseCase: IMarkBillPaid,
    private createBillUseCase: ICreateBill,
    private payBillWithPDAUseCase: IPayBillWithPDA,
    private getBillByIdUseCase: IGetBillById,
    private createRazorpayOrderUseCase: ICreateRazorpayOrder,
    private verifyRazorpayPaymentUseCase: IVerifyRazorpayPayment,
    private getBillTransactionsUseCase: IGetBillTransactions,
    private getOverdueStatusUseCase: IGetOverdueStatus,
  ) {}

  getBills = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    let { customerId } = req.query;

    // If the user is a customer, they should only see their own bills
    if (req.user?.role === "customer") {
      customerId = req.user.id;
    }

    const bills = await this.getBillsUseCase.execute({ 
      customerId: customerId as string,
      status: status as string 
    });
    return res.status(HttpStatus.OK).json(ApiResponse.success(bills));
  });

  markBillPaid = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await this.markBillPaidUseCase.execute(id as string);
    return res.status(HttpStatus.OK).json(ApiResponse.success(updated, ResponseMessage.BILL_PAID_SUCCESS));
  });

  createBill = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.createBillUseCase.execute(req.body);
    return res.status(HttpStatus.CREATED).json(ApiResponse.success(result, ResponseMessage.BILL_CREATED));
  });

  payWithPDA = asyncHandler(async (req: Request, res: Response) => {
    const { id: billId } = req.params;
    const userId = req.user?.id;
    const userContext = req.user ? extractUserContext(req) : undefined;

    if (!userId) {
      throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const bill = await this.payBillWithPDAUseCase.execute({ 
      billId: billId as string, 
      userId: userId as string 
    }, userContext);
    return res.status(HttpStatus.OK).json(ApiResponse.success(bill, ResponseMessage.BILL_PAID_SUCCESS));
  });

  getBillById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const bill = await this.getBillByIdUseCase.execute(id as string);
    return res.status(HttpStatus.OK).json(ApiResponse.success(bill));
  });

  createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id: billId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const order = await this.createRazorpayOrderUseCase.execute(billId as string, userId as string);
    return res.status(HttpStatus.OK).json(ApiResponse.success(order));
  });

  verifyRazorpayPayment = asyncHandler(async (req: Request, res: Response) => {
    const { id: billId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const userContext = req.user ? extractUserContext(req) : undefined;

    const bill = await this.verifyRazorpayPaymentUseCase.execute(
      billId as string,
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userContext
    );
    return res.status(HttpStatus.OK).json(ApiResponse.success(bill, ResponseMessage.PAYMENT_VERIFIED));
  });

  getBillTransactions = asyncHandler(async (req: Request, res: Response) => {
    const { id: billId } = req.params;
    const user = req.user;

    if (!user) {
      throw new AppError(ResponseMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const userContext = extractUserContext(req);

    const transactions = await this.getBillTransactionsUseCase.execute({ 
      billId: billId as string 
    }, userContext);
    return res.status(HttpStatus.OK).json(ApiResponse.success(transactions));
  });

  getOverdueStatus = asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const isOverdue = await this.getOverdueStatusUseCase.execute(customerId as string);
    return res.status(HttpStatus.OK).json(ApiResponse.success({ isOverdue }));
  });
}


