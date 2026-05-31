import { Router } from "express";
import { GateOperationController } from "../controllers/GateOperationController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware, roleMiddleware } from "../middlewares/authMiddleware";

export const createGateOperationRouter = (
    tokenService: ITokenService,
    gateOperationController: GateOperationController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), gateOperationController.getGateOperations);
    router.post("/", authMiddleware, roleMiddleware(["operator"]), gateOperationController.createGateOperation);

    return router;
};
