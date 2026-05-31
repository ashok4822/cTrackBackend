import { Router } from "express";
import { BillingController } from "../controllers/BillingController";
import { ActivityController } from "../controllers/ActivityController";
import { ChargeController } from "../controllers/ChargeController";
import { CargoCategoryController } from "../controllers/CargoCategoryController";
import { ITokenService } from "../../application/services/ITokenService";
import { createAuthMiddleware, roleMiddleware } from "../middlewares/authMiddleware";

export const createBillingRouter = (
    tokenService: ITokenService,
    billingController: BillingController,
    activityController: ActivityController,
    chargeController: ChargeController,
    cargoCategoryController: CargoCategoryController
) => {
    const router = Router();
    const authMiddleware = createAuthMiddleware(tokenService);

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
