"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBillingRouter = void 0;
const express_1 = require("express");
const BillingController_1 = require("../controllers/BillingController");
const ActivityController_1 = require("../controllers/ActivityController");
const ChargeController_1 = require("../controllers/ChargeController");
const CargoCategoryController_1 = require("../controllers/CargoCategoryController");
const GetActivities_1 = require("../../application/useCases/GetActivities");
const CreateActivity_1 = require("../../application/useCases/CreateActivity");
const UpdateActivity_1 = require("../../application/useCases/UpdateActivity");
const GetCharges_1 = require("../../application/useCases/GetCharges");
const CreateCharge_1 = require("../../application/useCases/CreateCharge");
const GetChargeHistory_1 = require("../../application/useCases/GetChargeHistory");
const UpdateChargeRate_1 = require("../../application/useCases/UpdateChargeRate");
const GetBills_1 = require("../../application/useCases/GetBills");
const MarkBillPaid_1 = require("../../application/useCases/MarkBillPaid");
const CreateBill_1 = require("../../application/useCases/CreateBill");
const GetBillById_1 = require("../../application/useCases/GetBillById");
const PayBillWithPDA_1 = require("../../application/useCases/PayBillWithPDA");
const GetCargoCategories_1 = require("../../application/useCases/GetCargoCategories");
const CreateCargoCategory_1 = require("../../application/useCases/CreateCargoCategory");
const UpdateCargoCategory_1 = require("../../application/useCases/UpdateCargoCategory");
const CreateRazorpayOrder_1 = require("../../application/useCases/CreateRazorpayOrder");
const VerifyRazorpayPayment_1 = require("../../application/useCases/VerifyRazorpayPayment");
const GetBillTransactions_1 = require("../../application/useCases/GetBillTransactions");
const GetOverdueStatus_1 = require("../../application/useCases/GetOverdueStatus");
const ActivityRepository_1 = require("../../infrastructure/repositories/ActivityRepository");
const ChargeRepository_1 = require("../../infrastructure/repositories/ChargeRepository");
const ChargeHistoryRepository_1 = require("../../infrastructure/repositories/ChargeHistoryRepository");
const BillRepository_1 = require("../../infrastructure/repositories/BillRepository");
const PDARepository_1 = require("../../infrastructure/repositories/PDARepository");
const CargoCategoryRepository_1 = require("../../infrastructure/repositories/CargoCategoryRepository");
const BillTransactionRepository_1 = require("../../infrastructure/repositories/BillTransactionRepository");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const appConfig_1 = require("../../infrastructure/config/appConfig");
const RazorpayService_1 = require("../../infrastructure/services/RazorpayService");
const SocketNotificationService_1 = require("../../infrastructure/services/SocketNotificationService");
const EventEmitterBus_1 = require("../../infrastructure/events/EventEmitterBus");
const createBillingRouter = () => {
    const router = (0, express_1.Router)();
    // Infrastructure services
    const paymentService = new RazorpayService_1.RazorpayService(appConfig_1.appConfig);
    const notificationService = new SocketNotificationService_1.SocketNotificationService();
    // Repositories
    const activityRepo = new ActivityRepository_1.ActivityRepository();
    const chargeRepo = new ChargeRepository_1.ChargeRepository();
    const historyRepo = new ChargeHistoryRepository_1.ChargeHistoryRepository();
    const billRepo = new BillRepository_1.BillRepository();
    const pdaRepo = new PDARepository_1.PDARepository();
    const cargoCategoryRepo = new CargoCategoryRepository_1.CargoCategoryRepository();
    const transactionRepo = new BillTransactionRepository_1.BillTransactionRepository();
    // Use Cases
    const getActivities = new GetActivities_1.GetActivities(activityRepo);
    const createActivity = new CreateActivity_1.CreateActivity(activityRepo);
    const updateActivity = new UpdateActivity_1.UpdateActivity(activityRepo);
    const getCharges = new GetCharges_1.GetCharges(chargeRepo);
    const createCharge = new CreateCharge_1.CreateCharge(chargeRepo);
    const getChargeHistory = new GetChargeHistory_1.GetChargeHistory(historyRepo);
    const updateChargeRate = new UpdateChargeRate_1.UpdateChargeRate(chargeRepo, EventEmitterBus_1.eventBus);
    const getBills = new GetBills_1.GetBills(billRepo);
    const markBillPaid = new MarkBillPaid_1.MarkBillPaid(billRepo);
    const createBill = new CreateBill_1.CreateBill(billRepo);
    const payBillWithPDA = new PayBillWithPDA_1.PayBillWithPDA(billRepo, pdaRepo, EventEmitterBus_1.eventBus, notificationService, appConfig_1.appConfig, transactionRepo);
    const getBillById = new GetBillById_1.GetBillById(billRepo);
    const getCargoCategories = new GetCargoCategories_1.GetCargoCategories(cargoCategoryRepo);
    const createCargoCategory = new CreateCargoCategory_1.CreateCargoCategory(cargoCategoryRepo);
    const updateCargoCategory = new UpdateCargoCategory_1.UpdateCargoCategory(cargoCategoryRepo);
    const createRazorpayOrder = new CreateRazorpayOrder_1.CreateRazorpayOrder(billRepo, transactionRepo, paymentService);
    const verifyRazorpayPayment = new VerifyRazorpayPayment_1.VerifyRazorpayPayment(billRepo, paymentService, notificationService, EventEmitterBus_1.eventBus, transactionRepo);
    const getBillTransactions = new GetBillTransactions_1.GetBillTransactions(transactionRepo);
    const getOverdueStatus = new GetOverdueStatus_1.GetOverdueStatus(billRepo);
    // Controllers
    const activityController = new ActivityController_1.ActivityController(getActivities, createActivity, updateActivity);
    const chargeController = new ChargeController_1.ChargeController(getCharges, createCharge, getChargeHistory, updateChargeRate);
    const cargoCategoryController = new CargoCategoryController_1.CargoCategoryController(getCargoCategories, createCargoCategory, updateCargoCategory);
    const billingController = new BillingController_1.BillingController(getBills, markBillPaid, createBill, payBillWithPDA, getBillById, createRazorpayOrder, verifyRazorpayPayment, getBillTransactions, getOverdueStatus);
    // Apply auth middleware to all billing routes
    router.use(authMiddleWare_1.authMiddleware);
    // Activity endpoints
    router.get("/activities", (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), activityController.getActivities);
    router.post("/activities", (0, authMiddleWare_1.roleMiddleware)(["admin"]), activityController.createActivity);
    router.patch("/activities/:id", (0, authMiddleWare_1.roleMiddleware)(["admin"]), activityController.updateActivity);
    // Charge endpoints
    router.get("/charges", (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), chargeController.getCharges);
    router.post("/charges", (0, authMiddleWare_1.roleMiddleware)(["admin"]), chargeController.createCharge);
    router.get("/charges/history", (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), chargeController.getHistory);
    router.patch("/charges/:id", (0, authMiddleWare_1.roleMiddleware)(["admin"]), chargeController.updateChargeRate);
    // Bills endpoints
    router.get("/bills/overdue-status", (0, authMiddleWare_1.roleMiddleware)(["customer"]), billingController.getOverdueStatus);
    router.get("/bills", (0, authMiddleWare_1.roleMiddleware)(["admin", "operator", "customer"]), billingController.getBills);
    router.post("/bills", (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), billingController.createBill);
    router.get("/bills/:id", (0, authMiddleWare_1.roleMiddleware)(["admin", "operator", "customer"]), billingController.getBillById);
    router.get("/bills/:id/transactions", (0, authMiddleWare_1.roleMiddleware)(["admin", "operator", "customer"]), billingController.getBillTransactions);
    router.patch("/bills/:id/paid", (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), billingController.markBillPaid);
    router.post("/bills/:id/pay", (0, authMiddleWare_1.roleMiddleware)(["customer"]), billingController.payWithPDA); // Corrected method name
    router.post("/bills/:id/razorpay/order", (0, authMiddleWare_1.roleMiddleware)(["customer"]), billingController.createRazorpayOrder);
    router.post("/bills/:id/razorpay/verify", (0, authMiddleWare_1.roleMiddleware)(["customer"]), billingController.verifyRazorpayPayment);
    // Cargo Categories
    router.get("/cargo-categories", cargoCategoryController.getCargoCategories);
    router.post("/cargo-categories", (0, authMiddleWare_1.roleMiddleware)(["admin"]), cargoCategoryController.createCargoCategory);
    router.patch("/cargo-categories/:id", (0, authMiddleWare_1.roleMiddleware)(["admin"]), cargoCategoryController.updateCargoCategory);
    return router;
};
exports.createBillingRouter = createBillingRouter;
//# sourceMappingURL=billingRoutes.js.map