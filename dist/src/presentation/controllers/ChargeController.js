"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class ChargeController {
    getChargesUseCase;
    createChargeUseCase;
    getChargeHistoryUseCase;
    updateChargeRateUseCase;
    constructor(getChargesUseCase, createChargeUseCase, getChargeHistoryUseCase, updateChargeRateUseCase) {
        this.getChargesUseCase = getChargesUseCase;
        this.createChargeUseCase = createChargeUseCase;
        this.getChargeHistoryUseCase = getChargeHistoryUseCase;
        this.updateChargeRateUseCase = updateChargeRateUseCase;
    }
    getCharges = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const charges = await this.getChargesUseCase.execute();
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(charges));
    });
    createCharge = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const created = await this.createChargeUseCase.execute(req.body);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(created, ResponseMessage_1.ResponseMessage.CHARGE_CREATED));
    });
    updateChargeRate = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const updated = await this.updateChargeRateUseCase.execute(id, req.body);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(updated, ResponseMessage_1.ResponseMessage.CHARGE_UPDATED));
    });
    getHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const history = await this.getChargeHistoryUseCase.execute();
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(history));
    });
}
exports.ChargeController = ChargeController;
//# sourceMappingURL=ChargeController.js.map