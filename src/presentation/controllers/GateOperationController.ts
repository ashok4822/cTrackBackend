import { Request, Response } from "express";
import { CreateGateOperation } from "../../application/useCases/CreateGateOperation";
import { GetGateOperations } from "../../application/useCases/GetGateOperations";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { GateOperationFilters } from "../../domain/repositories/IGateOperationRepository";

export class GateOperationController {
    constructor(
        private createGateOperationUseCase: CreateGateOperation,
        private getGateOperationsUseCase: GetGateOperations
    ) { }

    async createGateOperation(req: Request, res: Response) {
        try {
            await this.createGateOperationUseCase.execute(req.body);
            return res.status(HttpStatus.CREATED).json({ message: "Gate operation recorded successfully" });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            return res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }

    async getGateOperations(req: Request, res: Response) {
        try {
            const filters = req.query as unknown as GateOperationFilters;
            const operations = await this.getGateOperationsUseCase.execute(filters);
            return res.status(HttpStatus.OK).json(operations);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            return res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }
}
