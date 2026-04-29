import { Router } from "express";
import { ContainerController } from "../controllers/ContainerController";
import { CreateContainer } from "../../application/useCases/CreateContainer";
import { GetAllContainers } from "../../application/useCases/GetAllContainers";
import { GetContainerById } from "../../application/useCases/GetContainerById";
import { UpdateContainer } from "../../application/useCases/UpdateContainer";
import { BlacklistContainer } from "../../application/useCases/BlacklistContainer";
import { UnblacklistContainer } from "../../application/useCases/UnblacklistContainer";
import { GetContainerHistory } from "../../application/useCases/GetContainerHistory";
import { GetCustomerContainers } from "../../application/useCases/GetCustomerContainers";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { ContainerHistoryRepository } from "../../infrastructure/repositories/ContainerHistoryRepository";
import { EquipmentRepository } from "../../infrastructure/repositories/EquipmentRepository";
import { BlockRepository } from "../../infrastructure/repositories/BlockRepository";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { eventBus } from "../../infrastructure/events/EventEmitterBus";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";
import { createCheckOverdueBillsMiddleware } from "../../infrastructure/services/checkOverdueBills";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";

export const createContainerRouter = () => {
    const router = Router();
    const repository = new ContainerRepository();
    const historyRepository = new ContainerHistoryRepository();
    const equipmentRepository = new EquipmentRepository();
    const blockRepository = new BlockRepository();
    const containerRequestRepository = new ContainerRequestRepository();
    const billRepository = new BillRepository();

    const checkOverdueBills = createCheckOverdueBillsMiddleware(billRepository);

    const createUseCase = new CreateContainer(repository, eventBus);
    const getAllUseCase = new GetAllContainers(repository);
    const getByIdUseCase = new GetContainerById(repository);
    const updateUseCase = new UpdateContainer(
        repository,
        equipmentRepository,
        blockRepository,
        eventBus
    );
    const blacklistUseCase = new BlacklistContainer(repository, eventBus);
    const unblacklistUseCase = new UnblacklistContainer(repository, eventBus);
    const getHistoryUseCase = new GetContainerHistory(historyRepository);
    const getCustomerContainersUseCase = new GetCustomerContainers(repository, containerRequestRepository);

    const controller = new ContainerController(
        createUseCase,
        getAllUseCase,
        getByIdUseCase,
        updateUseCase,
        blacklistUseCase,
        unblacklistUseCase,
        getHistoryUseCase,
        getCustomerContainersUseCase
    );

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), controller.getAllContainers);
    router.get("/my-containers", authMiddleware, roleMiddleware(["customer"]), checkOverdueBills, controller.getCustomerContainers);
    router.get("/:id/history", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), controller.getContainerHistory);
    router.get("/:id", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), controller.getContainerById);
    router.post("/", authMiddleware, roleMiddleware(["admin"]), controller.createContainer);
    router.put("/:id", authMiddleware, roleMiddleware(["admin", "operator"]), controller.updateContainer);
    router.patch("/:id/blacklist", authMiddleware, roleMiddleware(["admin"]), controller.blacklistContainer);
    router.patch("/:id/unblacklist", authMiddleware, roleMiddleware(["admin"]), controller.unblacklistContainer);

    return router;
};
