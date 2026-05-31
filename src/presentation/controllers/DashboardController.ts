import { Request, Response } from "express";
import { IGetDashboardKPIs } from "../../application/ports/IGetDashboardKPIs";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class DashboardController {
    constructor(
        private readonly _getDashboardKPIsUseCase: IGetDashboardKPIs
    ) { }

    getKPIs = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user;
        const kpis = await this._getDashboardKPIsUseCase.execute({
            role: user?.role,
            customerName: user?.companyName || user?.name,
            userId: user?.id
        });
        return res.status(HttpStatus.OK).json(ApiResponse.success(kpis));
    });
}

