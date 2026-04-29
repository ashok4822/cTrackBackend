import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuditLogController } from "../controllers/AuditLogController";
import { AdminCreateUser } from "../../application/useCases/AdminCreateUser";
import { GetUserProfile } from "../../application/useCases/GetUserProfile";
import { UpdateUserProfile } from "../../application/useCases/UpdateUserProfile";
import { UpdatePassword } from "../../application/useCases/UpdatePassword";
import { UpdateUserProfileImage } from "../../application/useCases/UpdateUserProfileImage";
import { GetAllUsers } from "../../application/useCases/GetAllUsers";
import { ToggleUserBlockStatus } from "../../application/useCases/ToggleUserBlockStatus";
import { AdminUpdateUser } from "../../application/useCases/AdminUpdateUser";
import { GetAuditLogs } from "../../application/useCases/GetAuditLogs";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { MongoAuditLogRepository } from "../../infrastructure/repositories/MongoAuditLogRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { EmailService } from "../../infrastructure/services/EmailService";
import { upload } from "../../infrastructure/services/UploadService";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";
import { eventBus } from "../../infrastructure/events/EventEmitterBus";

export const createUserRouter = () => {
    const router = Router();

    // Dependencies
    const userRepository = new UserRepository();
    const auditLogRepository = new MongoAuditLogRepository();
    const hashService = new BcryptHashService();
    const emailService = new EmailService();

    // Use Cases
    const adminCreateUserUseCase = new AdminCreateUser(userRepository, hashService, emailService, eventBus);
    const getUserProfileUseCase = new GetUserProfile(userRepository);
    const updateUserProfileUseCase = new UpdateUserProfile(userRepository, eventBus);
    const updatePasswordUseCase = new UpdatePassword(userRepository, hashService, eventBus);
    const updateProfileImageUseCase = new UpdateUserProfileImage(userRepository);
    const getAllUsersUseCase = new GetAllUsers(userRepository);
    const toggleUserBlockStatusUseCase = new ToggleUserBlockStatus(userRepository, eventBus);
    const adminUpdateUserUseCase = new AdminUpdateUser(userRepository, eventBus);
    const getAuditLogsUseCase = new GetAuditLogs(auditLogRepository);

    // Controllers
    const userController = new UserController(
        adminCreateUserUseCase,
        getUserProfileUseCase,
        updateUserProfileUseCase,
        updatePasswordUseCase,
        updateProfileImageUseCase,
        getAllUsersUseCase,
        toggleUserBlockStatusUseCase,
        adminUpdateUserUseCase
    );
    const auditLogController = new AuditLogController(getAuditLogsUseCase);

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
