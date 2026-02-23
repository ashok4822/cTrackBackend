import { Request, Response } from "express";
import { GetGateOperations } from "../../application/useCases/GetGateOperations";
import { CreateGateOperation } from "../../application/useCases/CreateGateOperation";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class GateOperationController {
    constructor(
        private getGateOperationsUseCase: GetGateOperations,
        private createGateOperationUseCase: CreateGateOperation
    ) { }

    async getGateOperations(req: Request, res: Response) {
        try {
            const filters = req.query as any;
            const operations = await this.getGateOperationsUseCase.execute(filters);
            return res.status(HttpStatus.OK).json(operations);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async createGateOperation(req: Request, res: Response) {
        try {
            const performedBy = req.user?.name || req.user?.email || "System";
            await this.createGateOperationUseCase.execute(req.body, performedBy);
            return res.status(HttpStatus.CREATED).json({ message: "Gate operation recorded successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}
