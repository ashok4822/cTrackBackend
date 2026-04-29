"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVehicleRouter = void 0;
const express_1 = require("express");
const VehicleController_1 = require("../controllers/VehicleController");
const CreateVehicle_1 = require("../../application/useCases/CreateVehicle");
const UpdateVehicle_1 = require("../../application/useCases/UpdateVehicle");
const DeleteVehicle_1 = require("../../application/useCases/DeleteVehicle");
const GetAllVehicles_1 = require("../../application/useCases/GetAllVehicles");
const VehicleRepository_1 = require("../../infrastructure/repositories/VehicleRepository");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const createVehicleRouter = () => {
    const router = (0, express_1.Router)();
    const repository = new VehicleRepository_1.VehicleRepository();
    const createUseCase = new CreateVehicle_1.CreateVehicle(repository);
    const updateUseCase = new UpdateVehicle_1.UpdateVehicle(repository);
    const deleteUseCase = new DeleteVehicle_1.DeleteVehicle(repository);
    const getAllUseCase = new GetAllVehicles_1.GetAllVehicles(repository);
    const controller = new VehicleController_1.VehicleController(createUseCase, updateUseCase, deleteUseCase, getAllUseCase);
    router.get("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), controller.fetchAll);
    router.post("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), controller.create);
    router.put("/:id", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), controller.update);
    router.patch("/:id", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), controller.update);
    router.delete("/:id", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), controller.delete);
    return router;
};
exports.createVehicleRouter = createVehicleRouter;
//# sourceMappingURL=vehicleRoutes.js.map