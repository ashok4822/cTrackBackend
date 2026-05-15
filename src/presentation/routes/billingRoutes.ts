import { Router } from "express";
import { BillingController } from "../controllers/BillingController";
import { ActivityController } from "../controllers/ActivityController";
import { ChargeController } from "../controllers/ChargeController";
import { CargoCategoryController } from "../controllers/CargoCategoryController";
import { GetActivities } from "../../application/useCases/GetActivities";
import { CreateActivity } from "../../application/useCases/CreateActivity";
import { UpdateActivity } from "../../application/useCases/UpdateActivity";
import { GetCharges } from "../../application/useCases/GetCharges";
import { CreateCharge } from "../../application/useCases/CreateCharge";
import { GetChargeHistory } from "../../application/useCases/GetChargeHistory";
import { UpdateChargeRate } from "../../application/useCases/UpdateChargeRate";
import { GetBills } from "../../application/useCases/GetBills";
import { MarkBillPaid } from "../../application/useCases/MarkBillPaid";
import { CreateBill } from "../../application/useCases/CreateBill";
import { GetBillById } from "../../application/useCases/GetBillById";
import { PayBillWithPDA } from "../../application/useCases/PayBillWithPDA";
import { GetCargoCategories } from "../../application/useCases/GetCargoCategories";
import { CreateCargoCategory } from "../../application/useCases/CreateCargoCategory";
import { UpdateCargoCategory } from "../../application/useCases/UpdateCargoCategory";
import { CreateRazorpayOrder } from "../../application/useCases/CreateRazorpayOrder";
import { VerifyRazorpayPayment } from "../../application/useCases/VerifyRazorpayPayment";
import { GetBillTransactions } from "../../application/useCases/GetBillTransactions";
import { GetOverdueStatus } from "../../application/useCases/GetOverdueStatus";
import { ActivityRepository } from "../../infrastructure/repositories/ActivityRepository";
import { ChargeRepository } from "../../infrastructure/repositories/ChargeRepository";
import { ChargeHistoryRepository } from "../../infrastructure/repositories/ChargeHistoryRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { CargoCategoryRepository } from "../../infrastructure/repositories/CargoCategoryRepository";
import { BillTransactionRepository } from "../../infrastructure/repositories/BillTransactionRepository";
import { RazorpayService } from "../../infrastructure/services/RazorpayService";
import { ITokenService } from "../../application/services/ITokenService";
import { IConfigService } from "../../application/services/IConfigService";
import { IEventBus } from "../../domain/events/IEventBus";
import { INotificationService } from "../../application/services/INotificationService";
import { createAuthMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createBillingRouter = (
    tokenService: ITokenService,
    config: IConfigService,
    eventBus: IEventBus,
    notificationService: INotificationService
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService, config.get("JWT_ACCESS_SECRET"));

    // Infrastructure services
    const paymentService = new RazorpayService(config);

    // Repositories
    const activityRepo = new ActivityRepository();
    const chargeRepo = new ChargeRepository();
    const historyRepo = new ChargeHistoryRepository();
    const billRepo = new BillRepository();
    const pdaRepo = new PDARepository();
    const cargoCategoryRepo = new CargoCategoryRepository();
    const transactionRepo = new BillTransactionRepository();

    // Use Cases
    const getActivities = new GetActivities(activityRepo);
    const createActivity = new CreateActivity(activityRepo);
    const updateActivity = new UpdateActivity(activityRepo);
    const getCharges = new GetCharges(chargeRepo);
    const createCharge = new CreateCharge(chargeRepo);
    const getChargeHistory = new GetChargeHistory(historyRepo);
    const updateChargeRate = new UpdateChargeRate(chargeRepo, eventBus);
    const getBills = new GetBills(billRepo);
    const markBillPaid = new MarkBillPaid(billRepo);
    const createBill = new CreateBill(billRepo);
    const payBillWithPDA = new PayBillWithPDA(billRepo, pdaRepo, eventBus, notificationService, config, transactionRepo);
    const getBillById = new GetBillById(billRepo);
    const getCargoCategories = new GetCargoCategories(cargoCategoryRepo);
    const createCargoCategory = new CreateCargoCategory(cargoCategoryRepo);
    const updateCargoCategory = new UpdateCargoCategory(cargoCategoryRepo);
    const createRazorpayOrder = new CreateRazorpayOrder(billRepo, transactionRepo, paymentService);
    const verifyRazorpayPayment = new VerifyRazorpayPayment(billRepo, paymentService, notificationService, eventBus, transactionRepo);
    const getBillTransactions = new GetBillTransactions(transactionRepo);
    const getOverdueStatus = new GetOverdueStatus(billRepo);

    // Controllers
    const activityController = new ActivityController(getActivities, createActivity, updateActivity);
    const chargeController = new ChargeController(getCharges, createCharge, getChargeHistory, updateChargeRate);
    const cargoCategoryController = new CargoCategoryController(getCargoCategories, createCargoCategory, updateCargoCategory);
    const billingController = new BillingController(
        getBills,
        markBillPaid,
        createBill,
        payBillWithPDA,
        getBillById,
        createRazorpayOrder,
        verifyRazorpayPayment,
        getBillTransactions,
        getOverdueStatus
    );

    // Apply auth middleware to all billing routes
    router.use(authMiddleware);

    // Activity endpoints
    router.get("/activities", roleMiddleware(["admin", "operator"]), activityController.getActivities);
    router.post("/activities", roleMiddleware(["admin"]), activityController.createActivity);
    router.patch("/activities/:id", roleMiddleware(["admin"]), activityController.updateActivity);

    // Charge endpoints
    router.get("/charges", roleMiddleware(["admin", "operator"]), chargeController.getCharges);
    router.post("/charges", roleMiddleware(["admin"]), chargeController.createCharge);
    router.get("/charges/history", roleMiddleware(["admin", "operator"]), chargeController.getHistory);
    router.patch("/charges/:id", roleMiddleware(["admin"]), chargeController.updateChargeRate);

    // Bills endpoints
    router.get("/bills/overdue-status", roleMiddleware(["customer"]), billingController.getOverdueStatus);
    router.get("/bills", roleMiddleware(["admin", "operator", "customer"]), billingController.getBills);
    router.post("/bills", roleMiddleware(["admin", "operator"]), billingController.createBill);
    router.get("/bills/:id", roleMiddleware(["admin", "operator", "customer"]), billingController.getBillById);
    router.get("/bills/:id/transactions", roleMiddleware(["admin", "operator", "customer"]), billingController.getBillTransactions);
    router.patch("/bills/:id/paid", roleMiddleware(["admin", "operator"]), billingController.markBillPaid);
    router.post("/bills/:id/pay", roleMiddleware(["customer"]), billingController.payWithPDA);
    router.post("/bills/:id/razorpay/order", roleMiddleware(["customer"]), billingController.createRazorpayOrder);
    router.post("/bills/:id/razorpay/verify", roleMiddleware(["customer"]), billingController.verifyRazorpayPayment);

    // Cargo Categories
    router.get("/cargo-categories", cargoCategoryController.getCargoCategories);
    router.post("/cargo-categories", roleMiddleware(["admin"]), cargoCategoryController.createCargoCategory);
    router.patch("/cargo-categories/:id", roleMiddleware(["admin"]), cargoCategoryController.updateCargoCategory);

    return router;
};
