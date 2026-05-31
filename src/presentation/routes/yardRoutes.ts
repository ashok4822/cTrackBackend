import { Router } from "express";
import { YardController } from "../controllers/YardController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware, roleMiddleware } from "../middlewares/authMiddleware";

export function createYardRouter(
    tokenService: ITokenService,
    yardController: YardController
): Router {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    // Routes
    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), yardController.getBlocks);
    router.post("/", authMiddleware, roleMiddleware(["admin"]), yardController.createBlock);
    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), yardController.updateBlock);

    return router;
}
