import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { ITokenService } from "../../application/services/ITokenService";
import {
    createAuthMiddleware,
    roleMiddleware,
} from "../middlewares/authMiddleware";

export const createVehicleRouter = (
    tokenService: ITokenService,
    vehicleController: VehicleController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    router.get(
        "/",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        vehicleController.fetchAll
    );
    router.post(
        "/",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        vehicleController.create
    );
    router.put(
        "/:id",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        vehicleController.update
    );
    router.patch(
        "/:id",
        authMiddleware,
        roleMiddleware(["admin", "operator"]),
        vehicleController.update
    );
    router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), vehicleController.delete);

    return router;
};
