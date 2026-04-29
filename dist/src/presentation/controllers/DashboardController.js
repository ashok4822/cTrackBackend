"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class DashboardController {
    getDashboardKPIsUseCase;
    constructor(getDashboardKPIsUseCase) {
        this.getDashboardKPIsUseCase = getDashboardKPIsUseCase;
    }
    getKPIs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const user = req.user;
        const kpis = await this.getDashboardKPIsUseCase.execute({
            role: user?.role,
            customerName: user?.companyName || user?.name,
            userId: user?.id
        });
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(kpis));
    });
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map