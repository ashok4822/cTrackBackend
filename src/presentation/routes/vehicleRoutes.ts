import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { CreateVehicle } from "../../application/useCases/CreateVehicle";
import { UpdateVehicle } from "../../application/useCases/UpdateVehicle";
import { DeleteVehicle } from "../../application/useCases/DeleteVehicle";
import { GetAllVehicles } from "../../application/useCases/GetAllVehicles";
import { VehicleRepository } from "../../infrastructure/repositories/VehicleRepository";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";
import {
    createAuthMiddleware,
    roleMiddleware,
} from "../../infrastructure/services/authMiddleWare";


export const createVehicleRouter = (
    tokenService: ITokenService,
    config: IConfigService
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService, config.get("JWT_ACCESS_SECRET"));
    const repository = new VehicleRepository();

    const createUseCase = new CreateVehicle(repository);
    const updateUseCase = new UpdateVehicle(repository);
    const deleteUseCase = new DeleteVehicle(repository);
    const getAllUseCase = new GetAllVehicles(repository);

    const controller = new VehicleController(
        createUseCase,
        updateUseCase,
        deleteUseCase,
        getAllUseCase
    );

    router.get(
        "/",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        controller.fetchAll
    );
    router.post(
        "/",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        controller.create
    );
    router.put(
        "/:id",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        controller.update
    );
    router.patch(
        "/:id",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        controller.update
    );
    router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), controller.delete);

    return router;
};
