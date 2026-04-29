import { Router } from "express";
import { ShippingLineController } from "../controllers/ShippingLineController";
import { CreateShippingLine } from "../../application/useCases/CreateShippingLine";
import { GetAllShippingLines } from "../../application/useCases/GetAllShippingLines";
import { UpdateShippingLine } from "../../application/useCases/UpdateShippingLine";
import { ShippingLineRepository } from "../../infrastructure/repositories/ShippingLineRepository";
import { MongoAuditLogRepository } from "../../infrastructure/repositories/MongoAuditLogRepository";
import { eventBus } from "../../infrastructure/events/EventEmitterBus";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createShippingLineRouter = () => {
    const router = Router();
    const repository = new ShippingLineRepository();
    const createUseCase = new CreateShippingLine(repository, eventBus);
    const getAllUseCase = new GetAllShippingLines(repository);
    const updateUseCase = new UpdateShippingLine(repository, eventBus);

    const controller = new ShippingLineController(createUseCase, getAllUseCase, updateUseCase);

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), controller.getAllShippingLines);
    router.post("/", authMiddleware, roleMiddleware(["admin"]), controller.createShippingLine);
    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), controller.updateShippingLine);

    return router;
};
