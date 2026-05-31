import { Router } from "express";
import { IUploadProvider } from "../ports/IUploadProvider";
import { UserController } from "../controllers/UserController";
import { AuditLogController } from "../controllers/AuditLogController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware, roleMiddleware } from "../middlewares/authMiddleware";

export const createUserRouter = (
    tokenService: ITokenService,
    upload: IUploadProvider,
    userController: UserController,
    auditLogController: AuditLogController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

    // Profile routes - authenticated users only
    router.get("/profile", authMiddleware, userController.getProfile);
    router.put("/profile", authMiddleware, userController.updateProfile);
    router.put("/password", authMiddleware, userController.updatePassword);
    router.post("/profile/image", authMiddleware, upload.single("image"), userController.updateProfileImage);

    // User management - admin only
    router.post("/", authMiddleware, roleMiddleware(["admin"]), userController.createUser);
    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), userController.getAllUsers);
    router.patch("/:id/block", authMiddleware, roleMiddleware(["admin"]), userController.toggleBlockStatus);
    router.put("/:id", authMiddleware, roleMiddleware(["admin"]), userController.updateUser);

    // Audit logs - admin only
    router.get("/audit-logs", authMiddleware, roleMiddleware(["admin"]), auditLogController.getAuditLogs);

    return router;
};
