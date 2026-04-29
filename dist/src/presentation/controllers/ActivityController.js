"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class ActivityController {
    getActivitiesUseCase;
    createActivityUseCase;
    updateActivityUseCase;
    constructor(getActivitiesUseCase, createActivityUseCase, updateActivityUseCase) {
        this.getActivitiesUseCase = getActivitiesUseCase;
        this.createActivityUseCase = createActivityUseCase;
        this.updateActivityUseCase = updateActivityUseCase;
    }
    getActivities = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const activities = await this.getActivitiesUseCase.execute();
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(activities));
    });
    createActivity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const created = await this.createActivityUseCase.execute(req.body);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(created, ResponseMessage_1.ResponseMessage.ACTIVITY_CREATED));
    });
    updateActivity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const updated = await this.updateActivityUseCase.execute(id, req.body);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(updated, ResponseMessage_1.ResponseMessage.ACTIVITY_UPDATED));
    });
}
exports.ActivityController = ActivityController;
//# sourceMappingURL=ActivityController.js.map