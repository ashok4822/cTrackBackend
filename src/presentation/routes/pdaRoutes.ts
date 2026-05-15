import { Router } from "express";
import { PDAController } from "../controllers/PDAController";
import { GetPDA } from "../../application/useCases/GetPDA";
import { CreateRazorpayPDAOrder } from "../../application/useCases/CreateRazorpayPDAOrder";
import { VerifyRazorpayPDAPayment } from "../../application/useCases/VerifyRazorpayPDAPayment";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { RazorpayService } from "../../infrastructure/services/RazorpayService";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";
import { createAuthMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createPDARouter = (
    tokenService: ITokenService,
    config: IConfigService
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService, config.get("JWT_ACCESS_SECRET"));

    const paymentService = new RazorpayService(config);

    const pdaRepository = new PDARepository();
    const userRepository = new UserRepository();

    const getPDAUseCase = new GetPDA(pdaRepository, userRepository, config);
    const createRazorpayOrder = new CreateRazorpayPDAOrder(paymentService);
    const verifyRazorpayPayment = new VerifyRazorpayPDAPayment(pdaRepository, paymentService);

    const pdaController = new PDAController(
        getPDAUseCase,
        createRazorpayOrder,
        verifyRazorpayPayment
    );

    router.get("/", authMiddleware, pdaController.getPDA);
    router.post("/razorpay/order", authMiddleware, roleMiddleware(["customer"]), pdaController.createRazorpayOrder);
    router.post("/razorpay/verify", authMiddleware, roleMiddleware(["customer"]), pdaController.verifyRazorpayPayment);

    return router;
};
