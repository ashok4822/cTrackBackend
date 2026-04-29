import { Router } from "express";
import { PDAController } from "../controllers/PDAController";
import { GetPDA } from "../../application/useCases/GetPDA";
import { CreateRazorpayPDAOrder } from "../../application/useCases/CreateRazorpayPDAOrder";
import { VerifyRazorpayPDAPayment } from "../../application/useCases/VerifyRazorpayPDAPayment";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";
import { appConfig } from "../../infrastructure/config/appConfig";
import { RazorpayService } from "../../infrastructure/services/RazorpayService";

export const createPDARouter = () => {
    const router = Router();

    const configService = appConfig;
    const paymentService = new RazorpayService(configService);

    const pdaRepository = new PDARepository();
    const userRepository = new UserRepository();

    const getPDAUseCase = new GetPDA(pdaRepository, userRepository, configService);
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
