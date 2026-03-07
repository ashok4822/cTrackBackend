import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { GetDashboardKPIs } from "../../application/useCases/GetDashboardKPIs";

export const createDashboardRouter = () => {
    const router = Router();

    const getDashboardKPIsUseCase = new GetDashboardKPIs();
    const controller = new DashboardController(getDashboardKPIsUseCase);

    router.get("/kpi", (req, res) => controller.getKPIs(req, res));

    return router;
};
