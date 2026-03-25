import { Router } from "express";
import { ContainerRequestController } from "../controllers/ContainerRequestController";
import { CreateContainerRequest } from "../../application/useCases/CreateContainerRequest";
import { MongoAuditLogRepository } from "../../infrastructure/repositories/MongoAuditLogRepository";
import { GetCustomerRequests } from "../../application/useCases/GetCustomerRequests";
import { GetContainerById } from "../../application/useCases/GetContainerById";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { ActivityRepository } from "../../infrastructure/repositories/ActivityRepository";
import { ChargeRepository } from "../../infrastructure/repositories/ChargeRepository";
import { EquipmentHistoryRepository } from "../../infrastructure/repositories/EquipmentHistoryRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";
import { checkOverdueBills } from "../../infrastructure/services/checkOverdueBills";
import { GetAllContainerRequests } from "../../application/useCases/GetAllContainerRequests";
import { UpdateContainerRequest } from "../../application/useCases/UpdateContainerRequest";
import { NotificationService } from "../../infrastructure/services/NotificationService";

const router = Router();

const containerRequestRepository = new ContainerRequestRepository();
const containerRepository = new ContainerRepository();
const billRepository = new BillRepository();
const userRepository = new UserRepository();
const activityRepository = new ActivityRepository();
const chargeRepository = new ChargeRepository();
const equipmentHistoryRepository = new EquipmentHistoryRepository();
const auditLogRepository = new MongoAuditLogRepository();
const notificationService = new NotificationService();

const createContainerRequest = new CreateContainerRequest(
    containerRequestRepository,
    userRepository,
    notificationService,
    auditLogRepository
);
const getCustomerRequests = new GetCustomerRequests(containerRequestRepository);
const getContainerById = new GetContainerById(containerRepository);
const getAllContainerRequests = new GetAllContainerRequests(containerRequestRepository);
const updateContainerRequest = new UpdateContainerRequest(
    containerRequestRepository,
    containerRepository,
    billRepository,
    activityRepository,
    chargeRepository,
    equipmentHistoryRepository,
    auditLogRepository,
    notificationService
);

const controller = new ContainerRequestController(
    createContainerRequest,
    getCustomerRequests,
    getContainerById,
    getAllContainerRequests,
    updateContainerRequest
);

router.post("/", authMiddleware, checkOverdueBills, (req, res) => controller.create(req, res));
router.get("/my-requests", authMiddleware, checkOverdueBills, (req, res) => controller.getMyRequests(req, res));
router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), (req, res) => controller.getAll(req, res));
router.put("/:id", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), (req, res) => controller.update(req, res));

export default router;
