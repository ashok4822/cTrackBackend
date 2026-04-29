import { Router } from "express";
import { ContainerRequestController } from "../controllers/ContainerRequestController";
import { CreateContainerRequest } from "../../application/useCases/CreateContainerRequest";
import { GetCustomerRequests } from "../../application/useCases/GetCustomerRequests";
import { GetContainerById } from "../../application/useCases/GetContainerById";
import { GetContainerRequestById } from "../../application/useCases/GetContainerRequestById";
import { ContainerRequestRepository } from "../../infrastructure/repositories/ContainerRequestRepository";
import { ContainerRepository } from "../../infrastructure/repositories/ContainerRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { ActivityRepository } from "../../infrastructure/repositories/ActivityRepository";
import { ChargeRepository } from "../../infrastructure/repositories/ChargeRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";
import { createCheckOverdueBillsMiddleware } from "../../infrastructure/services/checkOverdueBills";
import { GetAllContainerRequests } from "../../application/useCases/GetAllContainerRequests";
import { UpdateContainerRequest } from "../../application/useCases/UpdateContainerRequest";
import { NotificationService } from "../../infrastructure/services/NotificationService";
import { BillingDomainService } from "../../domain/services/BillingDomainService";
import { eventBus } from "../../infrastructure/events/EventEmitterBus";

export const createContainerRequestRouter = () => {
    const router = Router();

    const containerRequestRepository = new ContainerRequestRepository();
    const containerRepository = new ContainerRepository();
    const billRepository = new BillRepository();
    const userRepository = new UserRepository();
    const activityRepository = new ActivityRepository();
    const chargeRepository = new ChargeRepository();
    const notificationService = new NotificationService();

    const billingService = new BillingDomainService(
        containerRepository,
        billRepository,
        activityRepository,
        chargeRepository
    );

    const checkOverdueBills = createCheckOverdueBillsMiddleware(billRepository);

    const createContainerRequest = new CreateContainerRequest(
        containerRequestRepository,
        userRepository,
        notificationService,
        eventBus
    );
    const getCustomerRequests = new GetCustomerRequests(containerRequestRepository);
    const getContainerById = new GetContainerById(containerRepository);
    const getContainerRequestById = new GetContainerRequestById(containerRequestRepository);
    const getAllContainerRequests = new GetAllContainerRequests(containerRequestRepository);
    const updateContainerRequest = new UpdateContainerRequest(
        containerRequestRepository,
        eventBus,
        billingService,
        containerRepository,
        billRepository,
        notificationService
    );

    const controller = new ContainerRequestController(
        createContainerRequest,
        getCustomerRequests,
        getContainerById,
        getAllContainerRequests,
        updateContainerRequest,
        getContainerRequestById
    );

    router.post("/", authMiddleware, checkOverdueBills, controller.create);
    router.get("/my-requests", authMiddleware, checkOverdueBills, controller.getMyRequests);
    router.get("/", authMiddleware, roleMiddleware(["admin", "operator"]), controller.getAll);
    router.put("/:id", authMiddleware, roleMiddleware(["admin", "operator", "customer"]), controller.update);

    return router;
};
