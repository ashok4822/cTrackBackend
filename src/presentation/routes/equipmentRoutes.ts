import { Router } from "express";
import { EquipmentController } from "../controllers/EquipmentController";
import { CreateEquipment } from "../../application/useCases/CreateEquipment";
import { UpdateEquipment } from "../../application/useCases/UpdateEquipment";
import { DeleteEquipment } from "../../application/useCases/DeleteEquipment";
import { GetAllEquipment } from "../../application/useCases/GetAllEquipment";
import { EquipmentRepository } from "../../infrastructure/repositories/EquipmentRepository";
import {
    authMiddleware,
    roleMiddleware,
} from "../../infrastructure/services/authMiddleWare";

export const createEquipmentRouter = () => {
    const router = Router();
    const repository = new EquipmentRepository();

    const createUseCase = new CreateEquipment(repository);
    const updateUseCase = new UpdateEquipment(repository);
    const deleteUseCase = new DeleteEquipment(repository);
    const getAllUseCase = new GetAllEquipment(repository);

    const controller = new EquipmentController(
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
    router.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.create(req, res)
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
