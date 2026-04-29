"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingLineController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class ShippingLineController {
    createShippingLineUseCase;
    getAllShippingLinesUseCase;
    updateShippingLineUseCase;
    constructor(createShippingLineUseCase, getAllShippingLinesUseCase, updateShippingLineUseCase) {
        this.createShippingLineUseCase = createShippingLineUseCase;
        this.getAllShippingLinesUseCase = getAllShippingLinesUseCase;
        this.updateShippingLineUseCase = updateShippingLineUseCase;
    }
    getUserContext(req) {
        const user = req.user;
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
        return {
            userId: user?.id || 'unknown',
            userName: user?.name || user?.email || 'unknown',
            userRole: user?.role || 'unknown',
            ipAddress
        };
    }
    createShippingLine = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { name, code } = req.body;
        const userContext = this.getUserContext(req);
        const result = await this.createShippingLineUseCase.execute({ name, code }, userContext);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(result, ResponseMessage_1.ResponseMessage.SHIPPING_LINE_CREATED));
    });
    getAllShippingLines = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const shippingLines = await this.getAllShippingLinesUseCase.execute();
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(shippingLines));
    });
    updateShippingLine = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { name, code } = req.body;
        const userContext = this.getUserContext(req);
        const result = await this.updateShippingLineUseCase.execute(id, { name, code }, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(result, ResponseMessage_1.ResponseMessage.SHIPPING_LINE_UPDATED));
    });
}
exports.ShippingLineController = ShippingLineController;
//# sourceMappingURL=ShippingLineController.js.map