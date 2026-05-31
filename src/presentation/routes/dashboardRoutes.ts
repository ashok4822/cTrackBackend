import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware } from "../middlewares/authMiddleware";

export const createDashboardRouter = (
    tokenService: ITokenService,
    dashboardController: DashboardController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    router.get("/kpi", authMiddleware, dashboardController.getKPIs);

    return router;
};
