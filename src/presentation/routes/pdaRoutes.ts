import { Router } from "express";
import { PDAController } from "../controllers/PDAController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware, roleMiddleware } from "../middlewares/authMiddleware";

export const createPDARouter = (
    tokenService: ITokenService,
    pdaController: PDAController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    router.get("/", authMiddleware, pdaController.getPDA);
    router.post("/razorpay/order", authMiddleware, roleMiddleware(["customer"]), pdaController.createRazorpayOrder);
    router.post("/razorpay/verify", authMiddleware, roleMiddleware(["customer"]), pdaController.verifyRazorpayPayment);

    return router;
};
