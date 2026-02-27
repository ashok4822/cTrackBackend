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
import {
  authMiddleware,
  roleMiddleware,
} from "../../infrastructure/services/authMiddleWare";

const userRouter = Router();

//DI
const userRepository = new UserRepository();
const auditLogRepository = new MongoAuditLogRepository();
const hashService = new BcryptHashService();
const emailService = new EmailService();
const adminCreateUserUseCase = new AdminCreateUser(userRepository, hashService, emailService, auditLogRepository);
const getUserProfileUseCase = new GetUserProfile(userRepository);
const updateUserProfileUseCase = new UpdateUserProfile(userRepository, auditLogRepository);
const updatePasswordUseCase = new UpdatePassword(userRepository, hashService, auditLogRepository);
const updateProfileImageUseCase = new UpdateUserProfileImage(userRepository);
const getAllUsersUseCase = new GetAllUsers(userRepository);
const toggleUserBlockStatusUseCase = new ToggleUserBlockStatus(userRepository, auditLogRepository);
const adminUpdateUserUseCase = new AdminUpdateUser(userRepository, auditLogRepository);
const getAuditLogsUseCase = new GetAuditLogs(auditLogRepository);

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
userRouter.get("/profile", authMiddleware, (req, res) =>
  userController.getProfile(req, res),
);

userRouter.put("/profile", authMiddleware, (req, res) =>
  userController.updateProfile(req, res),
);

userRouter.put("/password", authMiddleware, (req, res) =>
  userController.updatePassword(req, res),
);

userRouter.post(
  "/profile/image",
  authMiddleware,
  upload.single("image"),
  (req, res) => userController.updateProfileImage(req, res),
);

// Only admins can create and manage users
userRouter.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  userController.createUser(req, res),
);

userRouter.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) =>
  userController.getAllUsers(req, res)
);

userRouter.patch(
  "/:id/block",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => userController.toggleBlockStatus(req, res)
);

userRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => userController.updateUser(req, res)
);

// Audit logs - admin only
userRouter.get(
  "/audit-logs",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => auditLogController.getAuditLogs(req, res)
);

export { userRouter };
