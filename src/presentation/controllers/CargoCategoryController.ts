import { Request, Response } from "express";
import { IGetCargoCategories } from "../../application/ports/IGetCargoCategories";
import { ICreateCargoCategory } from "../../application/ports/ICreateCargoCategory";
import { IUpdateCargoCategory } from "../../application/ports/IUpdateCargoCategory";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class CargoCategoryController {
    constructor(
        private readonly _getCargoCategoriesUseCase: IGetCargoCategories,
        private readonly _createCargoCategoryUseCase: ICreateCargoCategory,
        private readonly _updateCargoCategoryUseCase: IUpdateCargoCategory
    ) { }

    getCargoCategories = asyncHandler(async (req: Request, res: Response) => {
        const categories = await this._getCargoCategoriesUseCase.execute();
        return res.status(HttpStatus.OK).json(ApiResponse.success(categories));
    });

    createCargoCategory = asyncHandler(async (req: Request, res: Response) => {
        const created = await this._createCargoCategoryUseCase.execute(req.body);
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(created, ResponseMessage.CARGO_CATEGORY_CREATED));
    });

    updateCargoCategory = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updated = await this._updateCargoCategoryUseCase.execute(id as string, req.body);
        return res.status(HttpStatus.OK).json(ApiResponse.success(updated, ResponseMessage.CARGO_CATEGORY_UPDATED));
    });
}

