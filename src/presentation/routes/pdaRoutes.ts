import { Router } from "express";
import { PDAController } from "../controllers/PDAController";
import { GetPDA } from "../../application/useCases/GetPDA";
import { CreateRazorpayPDAOrder } from "../../application/useCases/CreateRazorpayPDAOrder";
import { VerifyRazorpayPDAPayment } from "../../application/useCases/VerifyRazorpayPDAPayment";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createPDARouter = () => {
    const router = Router();

    const pdaRepository = new PDARepository();
    const userRepository = new UserRepository();

    const getPDAUseCase = new GetPDA(pdaRepository, userRepository);
    const createRazorpayOrder = new CreateRazorpayPDAOrder();
    const verifyRazorpayPayment = new VerifyRazorpayPDAPayment(pdaRepository);



    const pdaController = new PDAController(
        getPDAUseCase,
        createRazorpayOrder,
        verifyRazorpayPayment
    );

    router.get("/", authMiddleware, (req, res) => pdaController.getPDA(req, res));
    router.post("/razorpay/order", authMiddleware, roleMiddleware(["customer"]), (req, res) => pdaController.createRazorpayOrder(req, res));
    router.post("/razorpay/verify", authMiddleware, roleMiddleware(["customer"]), (req, res) => pdaController.verifyRazorpayPayment(req, res));

    return router;
};
