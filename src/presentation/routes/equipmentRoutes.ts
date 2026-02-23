import { Router } from "express";
import { EquipmentController } from "../controllers/EquipmentController";
import { CreateEquipment } from "../../application/useCases/CreateEquipment";
import { UpdateEquipment } from "../../application/useCases/UpdateEquipment";
import { DeleteEquipment } from "../../application/useCases/DeleteEquipment";
import { GetAllEquipment } from "../../application/useCases/GetAllEquipment";
import { GetEquipmentHistory } from "../../application/useCases/GetEquipmentHistory";
import { EquipmentRepository } from "../../infrastructure/repositories/EquipmentRepository";
import { EquipmentHistoryRepository } from "../../infrastructure/repositories/EquipmentHistoryRepository";
import {
    authMiddleware,
    roleMiddleware,
} from "../../infrastructure/services/authMiddleWare";

export const createEquipmentRouter = () => {
    const router = Router();
    const repository = new EquipmentRepository();

    const historyRepository = new EquipmentHistoryRepository();
    const createUseCase = new CreateEquipment(repository, historyRepository);
    const updateUseCase = new UpdateEquipment(repository, historyRepository);
    const deleteUseCase = new DeleteEquipment(repository);
    const getAllUseCase = new GetAllEquipment(repository);
    const getHistoryUseCase = new GetEquipmentHistory(historyRepository);

    const controller = new EquipmentController(
        createUseCase,
        updateUseCase,
        deleteUseCase,
        getAllUseCase,
        getHistoryUseCase
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
    router.get("/:id/history", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        controller.fetchHistory(req, res)
    );

    return router;
};
