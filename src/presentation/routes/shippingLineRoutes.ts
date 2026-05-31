import { Router } from "express";
import { ShippingLineController } from "../controllers/ShippingLineController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware, roleMiddleware } from "../middlewares/authMiddleware";

export const createShippingLineRouter = (
    tokenService: ITokenService,
    shippingLineController: ShippingLineController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), shippingLineController.getAllShippingLines);
    router.post("/", authMiddleware, roleMiddleware(["admin"]), shippingLineController.createShippingLine);
    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), shippingLineController.updateShippingLine);

    return router;
};
