"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YardController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const userContext_1 = require("../utils/userContext");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class YardController {
    _getBlocksUseCase;
    _createBlockUseCase;
    _updateBlockUseCase;
    constructor(_getBlocksUseCase, _createBlockUseCase, _updateBlockUseCase) {
        this._getBlocksUseCase = _getBlocksUseCase;
        this._createBlockUseCase = _createBlockUseCase;
        this._updateBlockUseCase = _updateBlockUseCase;
    }
    getBlocks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const blocks = await this._getBlocksUseCase.execute();
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(blocks));
    });
    updateBlock = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { name, capacity } = req.body;
        const userContext = (0, userContext_1.extractUserContext)(req);
        await this._updateBlockUseCase.execute(id, { name, capacity }, userContext);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.BLOCK_UPDATED));
    });
    createBlock = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { name, capacity } = req.body;
        const userContext = (0, userContext_1.extractUserContext)(req);
        await this._createBlockUseCase.execute({ name, capacity }, userContext);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.BLOCK_CREATED));
    });
}
exports.YardController = YardController;
//# sourceMappingURL=YardController.js.map