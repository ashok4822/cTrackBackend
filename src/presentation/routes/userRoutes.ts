import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AdminCreateUser } from "../../application/useCases/AdminCreateUser";
import { GetUserProfile } from "../../application/useCases/GetUserProfile";
import { UpdateUserProfile } from "../../application/useCases/UpdateUserProfile";
import { UpdatePassword } from "../../application/useCases/UpdatePassword";
import { UpdateUserProfileImage } from "../../application/useCases/UpdateUserProfileImage";
import { GetAllUsers } from "../../application/useCases/GetAllUsers";
import { ToggleUserBlockStatus } from "../../application/useCases/ToggleUserBlockStatus";
import { AdminUpdateUser } from "../../application/useCases/AdminUpdateUser";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { upload } from "../../infrastructure/services/UploadService";
import {
  authMiddleware,
  roleMiddleware,
} from "../../infrastructure/services/authMiddleWare";

const userRouter = Router();

//DI
const userRepository = new MongoUserRepository();
const hashService = new BcryptHashService();
const adminCreateUserUseCase = new AdminCreateUser(userRepository, hashService);
const getUserProfileUseCase = new GetUserProfile(userRepository);
const updateUserProfileUseCase = new UpdateUserProfile(userRepository);
const updatePasswordUseCase = new UpdatePassword(userRepository, hashService);
const updateProfileImageUseCase = new UpdateUserProfileImage(userRepository);
const getAllUsersUseCase = new GetAllUsers(userRepository);
const toggleUserBlockStatusUseCase = new ToggleUserBlockStatus(userRepository);
const adminUpdateUserUseCase = new AdminUpdateUser(userRepository);

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

//Only admins can create and manage users
userRouter.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  userController.createUser(req, res),
);

userRouter.get("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
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

export { userRouter };
