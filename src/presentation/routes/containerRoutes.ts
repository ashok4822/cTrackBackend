import { Router } from "express";
import { ContainerController } from "../controllers/ContainerController";
import { ITokenService } from "../../application/services/ITokenService";
import { IGetOverdueStatus } from "../../application/ports/IGetOverdueStatus";
import { createAuthMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { createCheckOverdueBillsMiddleware } from "../middlewares/checkOverdueBills";

export const createContainerRouter = (
    tokenService: ITokenService,
    getOverdueStatus: IGetOverdueStatus,
    containerController: ContainerController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    const checkOverdueBills = createCheckOverdueBillsMiddleware(getOverdueStatus);

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), containerController.getAllContainers);
    router.get("/my-containers", authMiddleware, roleMiddleware(["customer"]), checkOverdueBills, containerController.getCustomerContainers);
    router.get("/:id/history", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), containerController.getContainerHistory);
    router.get("/:id", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), containerController.getContainerById);
    router.post("/", authMiddleware, roleMiddleware(["admin"]), containerController.createContainer);
    router.put("/:id", authMiddleware, roleMiddleware(["admin", "operator"]), containerController.updateContainer);
    router.patch("/:id/blacklist", authMiddleware, roleMiddleware(["admin"]), containerController.blacklistContainer);
    router.patch("/:id/unblacklist", authMiddleware, roleMiddleware(["admin"]), containerController.unblacklistContainer);

    return router;
};
