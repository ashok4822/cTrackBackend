import { Request, Response } from "express";
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
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class BillingController {
    constructor(
        private getActivities: GetActivities,
        private createActivity: CreateActivity,
        private updateActivity: UpdateActivity,
        private getCharges: GetCharges,
        private createCharge: CreateCharge,
        private getChargeHistory: GetChargeHistory,
        private updateChargeRate: UpdateChargeRate,
        private getCargoCategories: GetCargoCategories,
        private createCargoCategory: CreateCargoCategory,
        private updateCargoCategory: UpdateCargoCategory,
        private getBillsUseCase?: GetBills,
        private markBillPaidUseCase?: MarkBillPaid,
        private createBillUseCase?: CreateBill,
        private payBillWithPDAUseCase?: PayBillWithPDA,
        private getBillByIdUseCase?: GetBillById
    ) { }

    async getAllActivities(req: Request, res: Response) {
        try {
            const activities = await this.getActivities.execute();
            res.status(HttpStatus.OK).json(activities);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async addActivity(req: Request, res: Response) {
        try {
            const activity = await this.createActivity.execute(req.body);
            res.status(HttpStatus.CREATED).json(activity);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async patchActivity(req: Request, res: Response) {
        try {
            const activity = await this.updateActivity.execute(req.params.id as string, req.body);
            if (!activity) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "Activity not found" });
            }
            res.status(HttpStatus.OK).json(activity);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getAllCharges(req: Request, res: Response) {
        try {
            const charges = await this.getCharges.execute();
            res.status(HttpStatus.OK).json(charges);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async addCharge(req: Request, res: Response) {
        try {
            const charge = await this.createCharge.execute(req.body);
            res.status(HttpStatus.CREATED).json(charge);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async patchChargeRate(req: Request, res: Response) {
        try {
            const charge = await this.updateChargeRate.execute(req.params.id as string, req.body);
            if (!charge) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "Charge not found" });
            }
            res.status(HttpStatus.OK).json(charge);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getHistory(req: Request, res: Response) {
        try {
            const history = await this.getChargeHistory.execute();
            res.status(HttpStatus.OK).json(history);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async getBills(req: Request, res: Response) {
        try {
            if (!this.getBillsUseCase) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Bills service not configured" });
            }
            const user = (req as any).user;
            const customerId = user?.role === "customer" ? user.id : undefined;

            const bills = await this.getBillsUseCase.execute(customerId);
            res.status(HttpStatus.OK).json(bills);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async markBillPaid(req: Request, res: Response) {
        try {
            if (!this.markBillPaidUseCase) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Bills service not configured" });
            }
            const { id } = req.params;
            const bill = await this.markBillPaidUseCase.execute(id as string);
            if (!bill) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "Bill not found" });
            }
            return res.status(HttpStatus.OK).json({ message: "Bill marked as paid", bill });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async addBill(req: Request, res: Response) {
        try {
            if (!this.createBillUseCase) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Create bill service not configured" });
            }
            const bill = await this.createBillUseCase.execute(req.body);
            res.status(HttpStatus.CREATED).json(bill);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getBill(req: Request, res: Response) {
        try {
            if (!this.getBillByIdUseCase) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Bill service not configured" });
            }
            const id = req.params.id as string;
            const bill = await this.getBillByIdUseCase.execute(id);
            if (!bill) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "Bill not found" });
            }
            res.status(HttpStatus.OK).json(bill);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async payBill(req: Request, res: Response) {
        try {
            if (!this.payBillWithPDAUseCase) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Payment service not configured" });
            }
            const id = req.params.id as string;
            const user = (req as any).user;
            if (!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "User not authenticated" });
            }

            const bill = await this.payBillWithPDAUseCase.execute(id as string, user.id);
            res.status(HttpStatus.OK).json({ message: "Bill paid successfully", bill });
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getAllCargoCategories(req: Request, res: Response) {
        try {
            const categories = await this.getCargoCategories.execute();
            res.status(HttpStatus.OK).json(categories);
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    async addCargoCategory(req: Request, res: Response) {
        try {
            const category = await this.createCargoCategory.execute(req.body);
            res.status(HttpStatus.CREATED).json(category);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async patchCargoCategory(req: Request, res: Response) {
        console.log(`PATCH /cargo-categories/${req.params.id}`, req.body);
        try {
            const category = await this.updateCargoCategory.execute(req.params.id as string, req.body);
            if (!category) {
                console.log(`Cargo category not found for ID: ${req.params.id}`);
                return res.status(HttpStatus.NOT_FOUND).json({ message: "Cargo category not found" });
            }
            res.status(HttpStatus.OK).json(category);
        } catch (error: any) {
            console.error(`Error patching cargo category: ${error.message}`);
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}
