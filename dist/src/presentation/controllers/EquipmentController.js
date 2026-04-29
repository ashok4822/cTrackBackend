"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class EquipmentController {
    createEquipment;
    updateEquipment;
    deleteEquipment;
    getAllEquipment;
    getEquipmentHistory;
    constructor(createEquipment, updateEquipment, deleteEquipment, getAllEquipment, getEquipmentHistory) {
        this.createEquipment = createEquipment;
        this.updateEquipment = updateEquipment;
        this.deleteEquipment = deleteEquipment;
        this.getAllEquipment = getAllEquipment;
        this.getEquipmentHistory = getEquipmentHistory;
    }
    fetchAll = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const filters = req.query;
        const equipment = await this.getAllEquipment.execute(filters);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(equipment));
    });
    create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const performedBy = req.user?.name || req.user?.email || "System";
        const equipment = await this.createEquipment.execute(req.body, performedBy);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(equipment, ResponseMessage_1.ResponseMessage.EQUIPMENT_CREATED));
    });
    update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const performedBy = req.user?.name || req.user?.email || "System";
        const equipment = await this.updateEquipment.execute(id, req.body, performedBy);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(equipment, ResponseMessage_1.ResponseMessage.EQUIPMENT_UPDATED));
    });
    delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await this.deleteEquipment.execute(id);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.EQUIPMENT_DELETED));
    });
    fetchHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const history = await this.getEquipmentHistory.execute(id);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(history));
    });
}
exports.EquipmentController = EquipmentController;
//# sourceMappingURL=EquipmentController.js.map