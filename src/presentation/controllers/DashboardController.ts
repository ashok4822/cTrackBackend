import { Request, Response } from "express";
import { GetDashboardKPIs } from "../../application/useCases/GetDashboardKPIs";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class DashboardController {
    constructor(
        private getDashboardKPIsUseCase: GetDashboardKPIs
    ) { }

    async getKPIs(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const kpis = await this.getDashboardKPIsUseCase.execute(
                user?.role,
                user?.companyName || user?.name,
                user?.id
            );
            return res.status(HttpStatus.OK).json(kpis);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}
