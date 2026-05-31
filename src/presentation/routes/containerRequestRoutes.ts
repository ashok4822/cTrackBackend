import { Router } from "express";
import { ContainerRequestController } from "../controllers/ContainerRequestController";
import { ITokenService } from "../../application/services/ITokenService";
import { IGetOverdueStatus } from "../../application/ports/IGetOverdueStatus";
import { createAuthMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { createCheckOverdueBillsMiddleware } from "../middlewares/checkOverdueBills";

export const createContainerRequestRouter = (
    tokenService: ITokenService,
    getOverdueStatus: IGetOverdueStatus,
    containerRequestController: ContainerRequestController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    const checkOverdueBills = createCheckOverdueBillsMiddleware(getOverdueStatus);

    router.post("/", authMiddleware, checkOverdueBills, containerRequestController.create);
    router.get("/my-requests", authMiddleware, checkOverdueBills, containerRequestController.getMyRequests);
    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), containerRequestController.getAll);
    router.put("/:id", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), containerRequestController.update);

    return router;
};
