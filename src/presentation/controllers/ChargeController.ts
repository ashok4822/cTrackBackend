import { Request, Response } from "express";
import { IGetCharges } from "../../application/ports/IGetCharges";
import { ICreateCharge } from "../../application/ports/ICreateCharge";
import { IGetChargeHistory } from "../../application/ports/IGetChargeHistory";
import { IUpdateChargeRate } from "../../application/ports/IUpdateChargeRate";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class ChargeController {
    constructor(
        private readonly _getChargesUseCase: IGetCharges,
        private readonly _createChargeUseCase: ICreateCharge,
        private readonly _getChargeHistoryUseCase: IGetChargeHistory,
        private readonly _updateChargeRateUseCase: IUpdateChargeRate
    ) { }

    getCharges = asyncHandler(async (req: Request, res: Response) => {
        const charges = await this._getChargesUseCase.execute();
        return res.status(HttpStatus.OK).json(ApiResponse.success(charges));
    });

    createCharge = asyncHandler(async (req: Request, res: Response) => {
        const created = await this._createChargeUseCase.execute(req.body);
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(created, ResponseMessage.CHARGE_CREATED));
    });

    updateChargeRate = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updated = await this._updateChargeRateUseCase.execute(id as string, req.body);
        return res.status(HttpStatus.OK).json(ApiResponse.success(updated, ResponseMessage.CHARGE_UPDATED));
    });

    getHistory = asyncHandler(async (req: Request, res: Response) => {
        const history = await this._getChargeHistoryUseCase.execute();
        return res.status(HttpStatus.OK).json(ApiResponse.success(history));
    });
}

