import { Request, Response } from "express";
import { IGetActivities } from "../../application/ports/IGetActivities";
import { ICreateActivity } from "../../application/ports/ICreateActivity";
import { IUpdateActivity } from "../../application/ports/IUpdateActivity";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class ActivityController {
    constructor(
        private readonly _getActivitiesUseCase: IGetActivities,
        private readonly _createActivityUseCase: ICreateActivity,
        private readonly _updateActivityUseCase: IUpdateActivity
    ) { }

    getActivities = asyncHandler(async (req: Request, res: Response) => {
        const activities = await this._getActivitiesUseCase.execute();
        return res.status(HttpStatus.OK).json(ApiResponse.success(activities));
    });

    createActivity = asyncHandler(async (req: Request, res: Response) => {
        const created = await this._createActivityUseCase.execute(req.body);
        return res.status(HttpStatus.CREATED).json(ApiResponse.success(created, ResponseMessage.ACTIVITY_CREATED));
    });

    updateActivity = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updated = await this._updateActivityUseCase.execute(id as string, req.body);
        return res.status(HttpStatus.OK).json(ApiResponse.success(updated, ResponseMessage.ACTIVITY_UPDATED));
    });
}



