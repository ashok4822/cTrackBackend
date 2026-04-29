import { Router } from "express";
import { EquipmentController } from "../controllers/EquipmentController";
import { CreateEquipment } from "../../application/useCases/CreateEquipment";
import { UpdateEquipment } from "../../application/useCases/UpdateEquipment";
import { DeleteEquipment } from "../../application/useCases/DeleteEquipment";
import { GetAllEquipment } from "../../application/useCases/GetAllEquipment";
import { GetEquipmentHistory } from "../../application/useCases/GetEquipmentHistory";
import { EquipmentRepository } from "../../infrastructure/repositories/EquipmentRepository";
import { EquipmentHistoryRepository } from "../../infrastructure/repositories/EquipmentHistoryRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { SocketNotificationService } from "../../infrastructure/services/SocketNotificationService";
import { eventBus } from "../../infrastructure/events/EventEmitterBus";
import {
    authMiddleware,
    roleMiddleware,
} from "../../infrastructure/services/authMiddleWare";

export const createEquipmentRouter = () => {
    const router = Router();
    const repository = new EquipmentRepository();
    const historyRepository = new EquipmentHistoryRepository();
    const userRepository = new UserRepository();
    const notificationService = new SocketNotificationService();

    const createUseCase = new CreateEquipment(repository, eventBus);
    const updateUseCase = new UpdateEquipment(repository, userRepository, eventBus, notificationService);

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
        controller.fetchAll
    );
    router.post("/", authMiddleware, roleMiddleware(["admin"]), controller.create);
    router.get("/:id/history", authMiddleware, controller.fetchHistory);
    router.put("/:id", authMiddleware, roleMiddleware(["admin", "operator"]), controller.update);
    router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), controller.delete);

    return router;
};
