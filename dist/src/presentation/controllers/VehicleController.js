"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiResponse_1 = require("../../shared/utils/ApiResponse");
class VehicleController {
    createVehicle;
    updateVehicle;
    deleteVehicle;
    getAllVehicles;
    constructor(createVehicle, updateVehicle, deleteVehicle, getAllVehicles) {
        this.createVehicle = createVehicle;
        this.updateVehicle = updateVehicle;
        this.deleteVehicle = deleteVehicle;
        this.getAllVehicles = getAllVehicles;
    }
    fetchAll = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const filters = req.query;
        const vehicles = await this.getAllVehicles.execute(filters);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(vehicles));
    });
    create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const vehicle = await this.createVehicle.execute(req.body);
        return res.status(HttpStatus_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success(vehicle, ResponseMessage_1.ResponseMessage.VEHICLE_CREATED));
    });
    update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const vehicle = await this.updateVehicle.execute(id, req.body);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(vehicle, ResponseMessage_1.ResponseMessage.VEHICLE_UPDATED));
    });
    delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await this.deleteVehicle.execute(id);
        return res.status(HttpStatus_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success(null, ResponseMessage_1.ResponseMessage.VEHICLE_DELETED));
    });
}
exports.VehicleController = VehicleController;
//# sourceMappingURL=VehicleController.js.map