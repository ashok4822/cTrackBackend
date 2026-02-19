import { Router } from "express";
import { EquipmentController } from "../controllers/EquipmentController";
import { GetAllEquipment } from "../../application/useCases/GetAllEquipment";
import { AddEquipment } from "../../application/useCases/AddEquipment";
import { UpdateEquipment } from "../../application/useCases/UpdateEquipment";
import { DeleteEquipment } from "../../application/useCases/DeleteEquipment";
import { EquipmentRepository } from "../../infrastructure/repositories/EquipmentRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createEquipmentRouter = () => {
    const router = Router();
    const repository = new EquipmentRepository();

    const getAllUseCase = new GetAllEquipment(repository);
    const addUseCase = new AddEquipment(repository);
    const updateUseCase = new UpdateEquipment(repository);
    const deleteUseCase = new DeleteEquipment(repository);

    const controller = new EquipmentController(
        getAllUseCase,
        addUseCase,
        updateUseCase,
        deleteUseCase
    );

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        controller.getAllEquipment(req, res)
    );

    router.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.addEquipment(req, res)
    );

    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.updateEquipment(req, res)
    );

    router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.deleteEquipment(req, res)
    );

    return router;
};
