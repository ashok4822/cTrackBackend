"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGateOperationRouter = void 0;
const express_1 = require("express");
const GateOperationController_1 = require("../controllers/GateOperationController");
const GetGateOperations_1 = require("../../application/useCases/GetGateOperations");
const CreateGateOperation_1 = require("../../application/useCases/CreateGateOperation");
const GateOperationRepository_1 = require("../../infrastructure/repositories/GateOperationRepository");
const ContainerRepository_1 = require("../../infrastructure/repositories/ContainerRepository");
const VehicleRepository_1 = require("../../infrastructure/repositories/VehicleRepository");
const ContainerRequestRepository_1 = require("../../infrastructure/repositories/ContainerRequestRepository");
const BillRepository_1 = require("../../infrastructure/repositories/BillRepository");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const EventEmitterBus_1 = require("../../infrastructure/events/EventEmitterBus");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const BlockRepository_1 = require("../../infrastructure/repositories/BlockRepository");
const VehicleDomainService_1 = require("../../domain/services/VehicleDomainService");
const ContainerDomainService_1 = require("../../domain/services/ContainerDomainService");
const BlockDomainService_1 = require("../../domain/services/BlockDomainService");
const createGateOperationRouter = () => {
    const router = (0, express_1.Router)();
    // Repositories
    const repository = new GateOperationRepository_1.GateOperationRepository();
    const containerRepository = new ContainerRepository_1.ContainerRepository();
    const vehicleRepository = new VehicleRepository_1.VehicleRepository();
    const containerRequestRepository = new ContainerRequestRepository_1.ContainerRequestRepository();
    const billRepository = new BillRepository_1.BillRepository();
    const userRepository = new UserRepository_1.UserRepository();
    const blockRepository = new BlockRepository_1.BlockRepository();
    // Domain Services
    const vehicleService = new VehicleDomainService_1.VehicleDomainService(vehicleRepository);
    const containerService = new ContainerDomainService_1.ContainerDomainService(containerRepository, userRepository);
    const blockService = new BlockDomainService_1.BlockDomainService(blockRepository);
    // Use Cases
    const getUseCase = new GetGateOperations_1.GetGateOperations(repository);
    const createUseCase = new CreateGateOperation_1.CreateGateOperation(repository, vehicleRepository, containerRepository, containerRequestRepository, vehicleService, containerService, blockService, EventEmitterBus_1.eventBus, billRepository);
    const controller = new GateOperationController_1.GateOperationController(getUseCase, createUseCase);
    router.get("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), controller.getGateOperations);
    router.post("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["operator"]), controller.createGateOperation);
    return router;
};
exports.createGateOperationRouter = createGateOperationRouter;
//# sourceMappingURL=gateOperationRoutes.js.map