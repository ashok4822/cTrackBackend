import { Router, Request, Response } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { GetDashboardKPIs } from "../../application/useCases/GetDashboardKPIs";
import { authMiddleware } from "../../infrastructure/services/authMiddleWare";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { GateOperationRepository } from "../../infrastructure/repositories/GateOperationRepository";
import { BlockRepository } from "../../infrastructure/repositories/BlockRepository";
import { ContainerHistoryRepository } from "../../infrastructure/repositories/ContainerHistoryRepository";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { EquipmentRepository } from "../../infrastructure/repositories/EquipmentRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";

export const createDashboardRouter = () => {
    const router = Router();

    const getDashboardKPIsUseCase = new GetDashboardKPIs(
        new ContainerRepository(),
        new GateOperationRepository(),
        new BlockRepository(),
        new ContainerHistoryRepository(),
        new ContainerRequestRepository(),
        new EquipmentRepository(),
        new BillRepository(),
        new PDARepository()
    );
    const controller = new DashboardController(getDashboardKPIsUseCase);

    router.get("/kpi", authMiddleware, (req: Request, res: Response) => controller.getKPIs(req, res));

    return router;
};
