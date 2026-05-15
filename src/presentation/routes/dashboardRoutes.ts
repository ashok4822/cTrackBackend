import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { GetDashboardKPIs } from "../../application/useCases/GetDashboardKPIs";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { GateOperationRepository } from "../../infrastructure/repositories/GateOperationRepository";
import { BlockRepository } from "../../infrastructure/repositories/BlockRepository";
import { ContainerHistoryRepository } from "../../infrastructure/repositories/ContainerHistoryRepository";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { EquipmentRepository } from "../../infrastructure/repositories/EquipmentRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { MongooseIdValidator } from "../../infrastructure/services/MongooseIdValidator";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";
import { createAuthMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createDashboardRouter = (
    tokenService: ITokenService,
    config: IConfigService
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService, config.get("JWT_ACCESS_SECRET"));

    const getDashboardKPIsUseCase = new GetDashboardKPIs(
        new ContainerRepository(),
        new GateOperationRepository(),
        new BlockRepository(),
        new ContainerHistoryRepository(),
        new ContainerRequestRepository(),
        new EquipmentRepository(),
        new BillRepository(),
        new PDARepository(),
        new MongooseIdValidator(),
        config
    );
    const controller = new DashboardController(getDashboardKPIsUseCase);

    router.get("/kpi", authMiddleware, controller.getKPIs);

    return router;
};
