import { Router } from "express";
import { EquipmentController } from "../controllers/EquipmentController";
import { ITokenService } from "../../application/services/ITokenService";
import {
    createAuthMiddleware,
    roleMiddleware,
} from "../middlewares/authMiddleware";

export const createEquipmentRouter = (
    tokenService: ITokenService,
    equipmentController: EquipmentController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    router.get(
        "/",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        equipmentController.fetchAll
    );
    router.post("/", authMiddleware, roleMiddleware(["admin"]), equipmentController.create);
    router.get("/:id/history", authMiddleware, equipmentController.fetchHistory);
    router.put("/:id", authMiddleware, roleMiddleware(["admin", "operator"]), equipmentController.update);
    router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), equipmentController.delete);

    return router;
};
