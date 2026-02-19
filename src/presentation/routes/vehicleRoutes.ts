import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { GetAllVehicles } from "../../application/useCases/GetAllVehicles";
import { AddVehicle } from "../../application/useCases/AddVehicle";
import { UpdateVehicle } from "../../application/useCases/UpdateVehicle";
import { DeleteVehicle } from "../../application/useCases/DeleteVehicle";
import { VehicleRepository } from "../../infrastructure/repositories/VehicleRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createVehicleRouter = () => {
    const router = Router();
    const repository = new VehicleRepository();

    const getAllUseCase = new GetAllVehicles(repository);
    const addUseCase = new AddVehicle(repository);
    const updateUseCase = new UpdateVehicle(repository);
    const deleteUseCase = new DeleteVehicle(repository);

    const controller = new VehicleController(
        getAllUseCase,
        addUseCase,
        updateUseCase,
        deleteUseCase
    );

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        controller.getAllVehicles(req, res)
    );

    router.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.addVehicle(req, res)
    );

    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.updateVehicle(req, res)
    );

    router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.deleteVehicle(req, res)
    );

    return router;
};
