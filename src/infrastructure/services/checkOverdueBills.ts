import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { BillModel } from "../models/BillModel";

export const checkOverdueBills = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void | Response> => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        // Only block customers with overdue bills
        if (user.role !== "customer") {
            return next();
        }

        const overdueBill = await BillModel.findOne({
            customer: user.id,
            status: "overdue"
        });

        if (overdueBill) {
            return res.status(HttpStatus.FORBIDDEN).json({
                message: "Access Denied: You have overdue bills. Please settle them to access this feature.",
                hasOverdueBills: true
            });
        }

        next();
    } catch (error) {
        console.error("Error in checkOverdueBills middleware:", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};
