import { Router, Request, Response } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { GetDashboardKPIs } from "../../application/useCases/GetDashboardKPIs";
import { authMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createDashboardRouter = () => {
    const router = Router();

    const getDashboardKPIsUseCase = new GetDashboardKPIs();
    const controller = new DashboardController(getDashboardKPIsUseCase);

    router.get("/kpi", authMiddleware, (req: Request, res: Response) => controller.getKPIs(req, res));

    return router;
};
