import { Router } from "express";
import { PDAController } from "../controllers/PDAController";
import { GetPDA } from "../../application/useCases/GetPDA";
import { DepositFunds } from "../../application/useCases/DepositFunds";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createPDARouter = () => {
    const router = Router();

    const pdaRepository = new PDARepository();
    const userRepository = new UserRepository();

    const getPDAUseCase = new GetPDA(pdaRepository, userRepository);
    const depositFundsUseCase = new DepositFunds(pdaRepository);

    const pdaController = new PDAController(getPDAUseCase, depositFundsUseCase);

    router.get("/", authMiddleware, (req, res) => pdaController.getPDA(req, res));
    router.post("/deposit", authMiddleware, roleMiddleware(["customer"]), (req, res) => pdaController.depositFunds(req, res));

    return router;
};
