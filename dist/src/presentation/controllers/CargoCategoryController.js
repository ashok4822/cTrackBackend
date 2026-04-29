"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoCategoryController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class CargoCategoryController {
    getCargoCategoriesUseCase;
    createCargoCategoryUseCase;
    updateCargoCategoryUseCase;
    constructor(getCargoCategoriesUseCase, createCargoCategoryUseCase, updateCargoCategoryUseCase) {
        this.getCargoCategoriesUseCase = getCargoCategoriesUseCase;
        this.createCargoCategoryUseCase = createCargoCategoryUseCase;
        this.updateCargoCategoryUseCase = updateCargoCategoryUseCase;
    }
    getCargoCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const categories = await this.getCargoCategoriesUseCase.execute();
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(categories));
    });
    createCargoCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const created = await this.createCargoCategoryUseCase.execute(req.body);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(created, ResponseMessage_1.ResponseMessage.CARGO_CATEGORY_CREATED));
    });
    updateCargoCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const updated = await this.updateCargoCategoryUseCase.execute(id, req.body);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(updated, ResponseMessage_1.ResponseMessage.CARGO_CATEGORY_UPDATED));
    });
}
exports.CargoCategoryController = CargoCategoryController;
//# sourceMappingURL=CargoCategoryController.js.map