"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createYardRouter = createYardRouter;
const express_1 = require("express");
const YardController_1 = require("../controllers/YardController");
const GetBlocks_1 = require("../../application/useCases/GetBlocks");
const CreateBlock_1 = require("../../application/useCases/CreateBlock");
const UpdateBlock_1 = require("../../application/useCases/UpdateBlock");
const BlockRepository_1 = require("../../infrastructure/repositories/BlockRepository");
const authMiddleWare_1 = require("../../infrastructure/services/authMiddleWare");
const EventEmitterBus_1 = require("../../infrastructure/events/EventEmitterBus");
function createYardRouter() {
    const router = (0, express_1.Router)();
    // DI
    const blockRepository = new BlockRepository_1.BlockRepository();
    const getBlocksUseCase = new GetBlocks_1.GetBlocks(blockRepository);
    const createBlockUseCase = new CreateBlock_1.CreateBlock(blockRepository, EventEmitterBus_1.eventBus);
    const updateBlockUseCase = new UpdateBlock_1.UpdateBlock(blockRepository, EventEmitterBus_1.eventBus);
    const yardController = new YardController_1.YardController(getBlocksUseCase, createBlockUseCase, updateBlockUseCase);
    // Routes
    router.get("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin", "operator"]), yardController.getBlocks);
    router.post("/", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), yardController.createBlock);
    router.put("/:id", authMiddleWare_1.authMiddleware, (0, authMiddleWare_1.roleMiddleware)(["admin"]), yardController.updateBlock);
    return router;
}
//# sourceMappingURL=yardRoutes.js.map