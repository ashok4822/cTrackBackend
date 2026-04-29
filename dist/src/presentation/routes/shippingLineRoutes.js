"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingLineRouter = void 0;
const express_1 = require("express");
const ShippingLineController_1 = require("../controllers/ShippingLineController");
const CreateShippingLine_1 = require("../../application/useCases/CreateShippingLine");
const GetAllShippingLines_1 = require("../../application/useCases/GetAllShippingLines");
const UpdateShippingLine_1 = require("../../application/useCases/UpdateShippingLine");
const ShippingLineRepository_1 = require("../../infrastructure/repositories/ShippingLineRepository");
const EventEmitterBus_1 = require("../../infrastructure/events/EventEmitterBus");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const createShippingLineRouter = () => {
    const router = (0, express_1.Router)();
    const repository = new ShippingLineRepository_1.ShippingLineRepository();
    const createUseCase = new CreateShippingLine_1.CreateShippingLine(repository, EventEmitterBus_1.eventBus);
    const getAllUseCase = new GetAllShippingLines_1.GetAllShippingLines(repository);
    const updateUseCase = new UpdateShippingLine_1.UpdateShippingLine(repository, EventEmitterBus_1.eventBus);
    const controller = new ShippingLineController_1.ShippingLineController(createUseCase, getAllUseCase, updateUseCase);
    router.get("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), controller.getAllShippingLines);
    router.post("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), controller.createShippingLine);
    router.put("/:id", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), controller.updateShippingLine);
    return router;
};
exports.createShippingLineRouter = createShippingLineRouter;
//# sourceMappingURL=shippingLineRoutes.js.map