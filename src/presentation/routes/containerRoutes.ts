import { Router } from "express";
import { ContainerController } from "../controllers/ContainerController";
import { CreateContainer } from "../../application/useCases/CreateContainer";
import { GetAllContainers } from "../../application/useCases/GetAllContainers";
import { GetContainerById } from "../../application/useCases/GetContainerById";
import { UpdateContainer } from "../../application/useCases/UpdateContainer";
import { BlacklistContainer } from "../../application/useCases/BlacklistContainer";
import { UnblacklistContainer } from "../../application/useCases/UnblacklistContainer";
import { GetContainerHistory } from "../../application/useCases/GetContainerHistory";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { ContainerHistoryRepository } from "../../infrastructure/repositories/ContainerHistoryRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createContainerRouter = () => {
    const router = Router();
    const repository = new ContainerRepository();
    const historyRepository = new ContainerHistoryRepository();

    const createUseCase = new CreateContainer(repository, historyRepository);
    const getAllUseCase = new GetAllContainers(repository);
    const getByIdUseCase = new GetContainerById(repository);
    const updateUseCase = new UpdateContainer(repository, historyRepository);
    const blacklistUseCase = new BlacklistContainer(repository, historyRepository);
    const unblacklistUseCase = new UnblacklistContainer(repository, historyRepository);
    const getHistoryUseCase = new GetContainerHistory(historyRepository);

    const controller = new ContainerController(
        createUseCase,
        getAllUseCase,
        getByIdUseCase,
        updateUseCase,
        blacklistUseCase,
        unblacklistUseCase,
        getHistoryUseCase
    );

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), (req, res) =>
        controller.getAllContainers(req, res)
    );

    router.get("/:id", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), (req, res) =>
        controller.getContainerById(req, res)
    );

    router.get("/:id/history", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), (req, res) =>
        controller.getContainerHistory(req, res)
    );

    router.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.createContainer(req, res)
    );

    router.put("/:id", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
        controller.updateContainer(req, res)
    );

    router.patch("/:id/blacklist", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.blacklistContainer(req, res)
    );

    router.patch("/:id/unblacklist", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
        controller.unblacklistContainer(req, res)
    );

    return router;
};
