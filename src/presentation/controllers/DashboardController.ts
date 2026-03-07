import { Request, Response } from "express";
import { GetDashboardKPIs } from "../../application/useCases/GetDashboardKPIs";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class DashboardController {
    constructor(
        private getDashboardKPIsUseCase: GetDashboardKPIs
    ) { }

    async getKPIs(req: Request, res: Response) {
        try {
            const kpis = await this.getDashboardKPIsUseCase.execute();
            return res.status(HttpStatus.OK).json(kpis);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}
