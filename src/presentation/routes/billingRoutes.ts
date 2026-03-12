import { Router } from "express";
import { BillingController } from "../controllers/BillingController";
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
import { MongoAuditLogRepository } from "../../infrastructure/repositories/MongoAuditLogRepository";
import { ActivityRepository } from "../../infrastructure/repositories/ActivityRepository";
import { ChargeRepository } from "../../infrastructure/repositories/ChargeRepository";
import { ChargeHistoryRepository } from "../../infrastructure/repositories/ChargeHistoryRepository";
import { BillRepository } from "../../infrastructure/repositories/BillRepository";
import { PDARepository } from "../../infrastructure/repositories/PDARepository";
import { CargoCategoryRepository } from "../../infrastructure/repositories/CargoCategoryRepository";
import { BillTransactionRepository } from "../../infrastructure/repositories/BillTransactionRepository";
import { authMiddleware, roleMiddleware } from "../../infrastructure/services/authMiddleWare";

export const createBillingRouter = () => {
    const router = Router();

    const activityRepo = new ActivityRepository();
    const chargeRepo = new ChargeRepository();
    const historyRepo = new ChargeHistoryRepository();
    const billRepo = new BillRepository();
    const pdaRepo = new PDARepository();
    const cargoCategoryRepo = new CargoCategoryRepository();
    const auditLogRepo = new MongoAuditLogRepository();
    const transactionRepo = new BillTransactionRepository();

    const getActivities = new GetActivities(activityRepo);
    const createActivity = new CreateActivity(activityRepo);
    const updateActivity = new UpdateActivity(activityRepo);
    const getCharges = new GetCharges(chargeRepo);
    const createCharge = new CreateCharge(chargeRepo);
    const getChargeHistory = new GetChargeHistory(historyRepo);
    const updateChargeRate = new UpdateChargeRate(chargeRepo, historyRepo);
    const getBills = new GetBills(billRepo);
    const markBillPaid = new MarkBillPaid(billRepo);
    const createBill = new CreateBill(billRepo);
    const payBillWithPDA = new PayBillWithPDA(billRepo, pdaRepo, auditLogRepo, transactionRepo);
    const getBillById = new GetBillById(billRepo);
    const getCargoCategories = new GetCargoCategories(cargoCategoryRepo);
    const createCargoCategory = new CreateCargoCategory(cargoCategoryRepo);
    const updateCargoCategory = new UpdateCargoCategory(cargoCategoryRepo);
    const createRazorpayOrder = new CreateRazorpayOrder(billRepo, transactionRepo);
    const verifyRazorpayPayment = new VerifyRazorpayPayment(billRepo, auditLogRepo, transactionRepo);
    const getBillTransactions = new GetBillTransactions(transactionRepo);

    const controller = new BillingController(
        getActivities,
        createActivity,
        updateActivity,
        getCharges,
        createCharge,
        getChargeHistory,
        updateChargeRate,
        getCargoCategories,
        createCargoCategory,
        updateCargoCategory,
        getBills,
        markBillPaid,
        createBill,
        payBillWithPDA,
        getBillById,
        createRazorpayOrder,
        verifyRazorpayPayment,
        getBillTransactions
    );

    // Apply auth middleware to all billing routes
    router.use(authMiddleware);

    router.get("/activities", roleMiddleware(["admin", "operator"]), (req, res) => controller.getAllActivities(req, res));
    router.post("/activities", roleMiddleware(["admin"]), (req, res) => controller.addActivity(req, res));
    router.patch("/activities/:id", roleMiddleware(["admin"]), (req, res) => controller.patchActivity(req, res));

    router.get("/charges", roleMiddleware(["admin", "operator"]), (req, res) => controller.getAllCharges(req, res));
    router.post("/charges", roleMiddleware(["admin"]), (req, res) => controller.addCharge(req, res));
    router.get("/charges/history", roleMiddleware(["admin", "operator"]), (req, res) => controller.getHistory(req, res));
    router.patch("/charges/:id", roleMiddleware(["admin"]), (req, res) => controller.patchChargeRate(req, res));

    // Bills endpoints
    router.get("/bills", roleMiddleware(["admin", "operator", "customer"]), (req, res) => controller.getBills(req, res));
    router.post("/bills", roleMiddleware(["admin", "operator"]), (req, res) => controller.addBill(req, res));
    router.get("/bills/:id", roleMiddleware(["admin", "operator", "customer"]), (req, res) => controller.getBill(req, res));
    router.get("/bills/:id/transactions", roleMiddleware(["admin", "operator", "customer"]), (req, res) => controller.getBillTransactions(req, res));
    router.patch("/bills/:id/paid", roleMiddleware(["admin", "operator"]), (req, res) => controller.markBillPaid(req, res));
    router.post("/bills/:id/pay", roleMiddleware(["customer"]), (req, res) => controller.payBill(req, res));
    router.post("/bills/:id/razorpay/order", roleMiddleware(["customer"]), (req, res) => controller.createRazorpayOrder(req, res));
    router.post("/bills/:id/razorpay/verify", roleMiddleware(["customer"]), (req, res) => controller.verifyRazorpayPayment(req, res));

    // Cargo Categories
    router.get("/cargo-categories", (req, res) => controller.getAllCargoCategories(req, res));
    router.post("/cargo-categories", roleMiddleware(["admin"]), (req, res) => controller.addCargoCategory(req, res));
    router.patch("/cargo-categories/:id", roleMiddleware(["admin"]), (req, res) => controller.patchCargoCategory(req, res));

    return router;
};
