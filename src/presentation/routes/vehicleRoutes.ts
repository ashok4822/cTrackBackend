import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { CreateVehicle } from "../../application/useCases/CreateVehicle";
import { UpdateVehicle } from "../../application/useCases/UpdateVehicle";
import { DeleteVehicle } from "../../application/useCases/DeleteVehicle";
import { GetAllVehicles } from "../../application/useCases/GetAllVehicles";
import { VehicleRepository } from "../../infrastructure/repositories/VehicleRepository";
import {
    authMiddleware,
    roleMiddleware,
} from "../../infrastructure/services/authMiddleWare";

export const createVehicleRouter = () => {
    const router = Router();
    const repository = new VehicleRepository();

    const createUseCase = new CreateVehicle(repository);
    const updateUseCase = new UpdateVehicle(repository);
    const deleteUseCase = new DeleteVehicle(repository);
    const getAllUseCase = new GetAllVehicles(repository);

    const controller = new VehicleController(
        createUseCase,
        updateUseCase,
        deleteUseCase,
        getAllUseCase
    );

    router.get(
        "/",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        (req, res) => controller.fetchAll(req, res)
    );
    router.post(
        "/",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        (req, res) => controller.create(req, res)
    );
    router.put(
        "/:id",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        (req, res) => controller.update(req, res)
    );
    router.patch(
        "/:id",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        (req, res) => controller.update(req, res)
    );
    router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.delete(req, res)
    );

    return router;
};
