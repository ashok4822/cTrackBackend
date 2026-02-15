import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AdminCreateUser } from "../../application/useCases/AdminCreateUser";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import {
  authMiddleware,
  roleMiddleware,
} from "../../infrastructure/services/authMiddleWare";

const userRouter = Router();

//DI
const userRepository = new MongoUserRepository();
const hashService = new BcryptHashService();
const adminCreateUserUseCase = new AdminCreateUser(userRepository, hashService);
const userController = new UserController(adminCreateUserUseCase);

//Only admins can create users
userRouter.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  userController.createUser(req, res),
);

export { userRouter };
