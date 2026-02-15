import { Router } from "express";
import { ShippingLineController } from "../controllers/ShippingLineController";
import { CreateShippingLine } from "../../application/useCases/CreateShippingLine";
import { GetAllShippingLines } from "../../application/useCases/GetAllShippingLines";
import { UpdateShippingLine } from "../../application/useCases/UpdateShippingLine";
import { MongoShippingLineRepository } from "../../infrastructure/repositories/MongoShippingLineRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createShippingLineRouter = () => {
    const router = Router();
    const repository = new MongoShippingLineRepository();
    const createUseCase = new CreateShippingLine(repository);
    const getAllUseCase = new GetAllShippingLines(repository);
    const updateUseCase = new UpdateShippingLine(repository);
    const controller = new ShippingLineController(createUseCase, getAllUseCase, updateUseCase);

    router.get("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.getAllShippingLines(req, res)
    );

    router.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.createShippingLine(req, res)
    );

    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.updateShippingLine(req, res)
    );

    return router;
};
