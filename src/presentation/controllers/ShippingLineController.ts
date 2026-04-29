import { Request, Response } from "express";
import { ICreateShippingLine } from "../../application/ports/ICreateShippingLine";
import { IGetAllShippingLines } from "../../application/ports/IGetAllShippingLines";
import { IUpdateShippingLine } from "../../application/ports/IUpdateShippingLine";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { UserContextDto } from "../../application/dto/CommonDto";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class ShippingLineController {
    constructor(
        private createShippingLineUseCase: ICreateShippingLine,
        private getAllShippingLinesUseCase: IGetAllShippingLines,
        private updateShippingLineUseCase: IUpdateShippingLine
    ) { }

    private getUserContext(req: Request): UserContextDto {
        const user = req.user;
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';
        return {
            userId: user?.id || 'unknown',
            userName: user?.name || user?.email || 'unknown',
            userRole: user?.role || 'unknown',
            ipAddress
        };
    }

    createShippingLine = asyncHandler(async (req: Request, res: Response) => {
        const { name, code } = req.body;
        const userContext = this.getUserContext(req);
        const result = await this.createShippingLineUseCase.execute({ name, code }, userContext);
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(result, ResponseMessage.SHIPPING_LINE_CREATED));
    });

    getAllShippingLines = asyncHandler(async (req: Request, res: Response) => {
        const shippingLines = await this.getAllShippingLinesUseCase.execute();
        return res.status(HttpStatus.OK).json(ApiResponse.success(shippingLines));
    });

    updateShippingLine = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, code } = req.body;
        const userContext = this.getUserContext(req);
        const result = await this.updateShippingLineUseCase.execute(id as string, { name, code }, userContext);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result, ResponseMessage.SHIPPING_LINE_UPDATED));
    });
}

