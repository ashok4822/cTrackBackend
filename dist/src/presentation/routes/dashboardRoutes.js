"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDashboardRouter = void 0;
const express_1 = require("express");
const DashboardController_1 = require("../controllers/DashboardController");
const GetDashboardKPIs_1 = require("../../application/useCases/GetDashboardKPIs");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const ContainerRepository_1 = require("../../infrastructure/repositories/ContainerRepository");
const GateOperationRepository_1 = require("../../infrastructure/repositories/GateOperationRepository");
const BlockRepository_1 = require("../../infrastructure/repositories/BlockRepository");
const ContainerHistoryRepository_1 = require("../../infrastructure/repositories/ContainerHistoryRepository");
const ContainerRequestRepository_1 = require("../../infrastructure/repositories/ContainerRequestRepository");
const EquipmentRepository_1 = require("../../infrastructure/repositories/EquipmentRepository");
const BillRepository_1 = require("../../infrastructure/repositories/BillRepository");
const PDARepository_1 = require("../../infrastructure/repositories/PDARepository");
const MongooseIdValidator_1 = require("../../infrastructure/services/MongooseIdValidator");
const appConfig_1 = require("../../infrastructure/config/appConfig");
const createDashboardRouter = () => {
    const router = (0, express_1.Router)();
    const configService = appConfig_1.appConfig;
    const getDashboardKPIsUseCase = new GetDashboardKPIs_1.GetDashboardKPIs(new ContainerRepository_1.ContainerRepository(), new GateOperationRepository_1.GateOperationRepository(), new BlockRepository_1.BlockRepository(), new ContainerHistoryRepository_1.ContainerHistoryRepository(), new ContainerRequestRepository_1.ContainerRequestRepository(), new EquipmentRepository_1.EquipmentRepository(), new BillRepository_1.BillRepository(), new PDARepository_1.PDARepository(), new MongooseIdValidator_1.MongooseIdValidator(), configService);
    const controller = new DashboardController_1.DashboardController(getDashboardKPIsUseCase);
    router.get("/kpi", authMiddleWare_1.authMiddleware, controller.getKPIs);
    return router;
};
exports.createDashboardRouter = createDashboardRouter;
//# sourceMappingURL=dashboardRoutes.js.map