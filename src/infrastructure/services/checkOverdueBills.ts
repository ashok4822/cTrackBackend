import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export const createCheckOverdueBillsMiddleware = (billRepository: IBillRepository) =>
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessage.UNAUTHORIZED });
            }

            // Only block customers with overdue bills
            if (user.role !== "customer") {
                return next();
            }

            const hasOverdue = await billRepository.hasOverdueBills(user.id);

            if (hasOverdue) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: ResponseMessage.OVERDUE_BILLS_ERROR,
                    hasOverdueBills: true,
                });
            }

            next();
        } catch (error) {
            console.error("Error in checkOverdueBills middleware:", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ResponseMessage.INTERNAL_SERVER_ERROR });
        }
    };
