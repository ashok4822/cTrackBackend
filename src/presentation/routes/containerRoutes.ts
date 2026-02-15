import { Router } from "express";
import { ContainerController } from "../controllers/ContainerController";
import { CreateContainer } from "../../application/useCases/CreateContainer";
import { GetAllContainers } from "../../application/useCases/GetAllContainers";
import { GetContainerById } from "../../application/useCases/GetContainerById";
import { UpdateContainer } from "../../application/useCases/UpdateContainer";
import { BlacklistContainer } from "../../application/useCases/BlacklistContainer";
import { UnblacklistContainer } from "../../application/useCases/UnblacklistContainer";
import { MongoContainerRepository } from "../../infrastructure/repositories/MongoContainerRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createContainerRouter = () => {
    const router = Router();
    const repository = new MongoContainerRepository();

    const createUseCase = new CreateContainer(repository);
    const getAllUseCase = new GetAllContainers(repository);
    const getByIdUseCase = new GetContainerById(repository);
    const updateUseCase = new UpdateContainer(repository);
    const blacklistUseCase = new BlacklistContainer(repository);
    const unblacklistUseCase = new UnblacklistContainer(repository);

    const controller = new ContainerController(
        createUseCase,
        getAllUseCase,
        getByIdUseCase,
        updateUseCase,
        blacklistUseCase,
        unblacklistUseCase
    );

    router.get("/", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), (req, res) =>
        controller.getAllContainers(req, res)
    );

    router.get("/:id", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), (req, res) =>
        controller.getContainerById(req, res)
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
