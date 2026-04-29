"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckOverdueBillsMiddleware = void 0;
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
const createCheckOverdueBillsMiddleware = (billRepository) => async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(HttpStatus_1.HttpStatus.UNAUTHORIZED).json({ message: ResponseMessage_1.ResponseMessage.UNAUTHORIZED });
        }
        // Only block customers with overdue bills
        if (user.role !== "customer") {
            return next();
        }
        const hasOverdue = await billRepository.hasOverdueBills(user.id);
        if (hasOverdue) {
            return res.status(HttpStatus_1.HttpStatus.FORBIDDEN).json({
                message: ResponseMessage_1.ResponseMessage.OVERDUE_BILLS_ERROR,
                hasOverdueBills: true,
            });
        }
        next();
    }
    catch (error) {
        console.error("Error in checkOverdueBills middleware:", error);
        return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ResponseMessage_1.ResponseMessage.INTERNAL_SERVER_ERROR });
    }
};
exports.createCheckOverdueBillsMiddleware = createCheckOverdueBillsMiddleware;
//# sourceMappingURL=checkOverdueBills.js.map