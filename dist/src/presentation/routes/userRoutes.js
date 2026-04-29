"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const AuditLogController_1 = require("../controllers/AuditLogController");
const AdminCreateUser_1 = require("../../application/useCases/AdminCreateUser");
const GetUserProfile_1 = require("../../application/useCases/GetUserProfile");
const UpdateUserProfile_1 = require("../../application/useCases/UpdateUserProfile");
const UpdatePassword_1 = require("../../application/useCases/UpdatePassword");
const UpdateUserProfileImage_1 = require("../../application/useCases/UpdateUserProfileImage");
const GetAllUsers_1 = require("../../application/useCases/GetAllUsers");
const ToggleUserBlockStatus_1 = require("../../application/useCases/ToggleUserBlockStatus");
const AdminUpdateUser_1 = require("../../application/useCases/AdminUpdateUser");
const GetAuditLogs_1 = require("../../application/useCases/GetAuditLogs");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const MongoAuditLogRepository_1 = require("../../infrastructure/repositories/MongoAuditLogRepository");
const BcryptHashService_1 = require("../../infrastructure/services/BcryptHashService");
const EmailService_1 = require("../../infrastructure/services/EmailService");
const UploadService_1 = require("../../infrastructure/services/UploadService");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const EventEmitterBus_1 = require("../../infrastructure/events/EventEmitterBus");
const createUserRouter = () => {
    const router = (0, express_1.Router)();
    // Dependencies
    const userRepository = new UserRepository_1.UserRepository();
    const auditLogRepository = new MongoAuditLogRepository_1.MongoAuditLogRepository();
    const hashService = new BcryptHashService_1.BcryptHashService();
    const emailService = new EmailService_1.EmailService();
    // Use Cases
    const adminCreateUserUseCase = new AdminCreateUser_1.AdminCreateUser(userRepository, hashService, emailService, EventEmitterBus_1.eventBus);
    const getUserProfileUseCase = new GetUserProfile_1.GetUserProfile(userRepository);
    const updateUserProfileUseCase = new UpdateUserProfile_1.UpdateUserProfile(userRepository, EventEmitterBus_1.eventBus);
    const updatePasswordUseCase = new UpdatePassword_1.UpdatePassword(userRepository, hashService, EventEmitterBus_1.eventBus);
    const updateProfileImageUseCase = new UpdateUserProfileImage_1.UpdateUserProfileImage(userRepository);
    const getAllUsersUseCase = new GetAllUsers_1.GetAllUsers(userRepository);
    const toggleUserBlockStatusUseCase = new ToggleUserBlockStatus_1.ToggleUserBlockStatus(userRepository, EventEmitterBus_1.eventBus);
    const adminUpdateUserUseCase = new AdminUpdateUser_1.AdminUpdateUser(userRepository, EventEmitterBus_1.eventBus);
    const getAuditLogsUseCase = new GetAuditLogs_1.GetAuditLogs(auditLogRepository);
    // Controllers
    const userController = new UserController_1.UserController(adminCreateUserUseCase, getUserProfileUseCase, updateUserProfileUseCase, updatePasswordUseCase, updateProfileImageUseCase, getAllUsersUseCase, toggleUserBlockStatusUseCase, adminUpdateUserUseCase);
    const auditLogController = new AuditLogController_1.AuditLogController(getAuditLogsUseCase);
    // Profile routes - authenticated users only
    router.get("/profile", authMiddleWare_1.authMiddleware, userController.getProfile);
    router.put("/profile", authMiddleWare_1.authMiddleware, userController.updateProfile);
    router.put("/password", authMiddleWare_1.authMiddleware, userController.updatePassword);
    router.post("/profile/image", authMiddleWare_1.authMiddleware, UploadService_1.upload.single("image"), userController.updateProfileImage);
    // User management - admin only
    router.post("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), userController.createUser);
    router.get("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), userController.getAllUsers);
    router.patch("/:id/block", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), userController.toggleBlockStatus);
    router.put("/:id", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), userController.updateUser);
    // Audit logs - admin only
    router.get("/audit-logs", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), auditLogController.getAuditLogs);
    return router;
};
exports.createUserRouter = createUserRouter;
//# sourceMappingURL=userRoutes.js.map