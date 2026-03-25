import { Request, Response } from "express";
import { GetGateOperations } from "../../application/useCases/GetGateOperations";
import { CreateGateOperation } from "../../application/useCases/CreateGateOperation";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { socketService } from "../../infrastructure/services/socketService";

export class GateOperationController {
    constructor(
        private getGateOperationsUseCase: GetGateOperations,
        private createGateOperationUseCase: CreateGateOperation
    ) { }

    async getGateOperations(req: Request, res: Response) {
        try {
            const filters = req.query as {
                type?: "gate-in" | "gate-out";
                containerNumber?: string;
                vehicleNumber?: string;
                limit?: string;
                status?: string;
            };
            const operations = await this.getGateOperationsUseCase.execute({
                ...filters,
                limit: filters.limit ? parseInt(filters.limit, 10) : undefined
            });
            return res.status(HttpStatus.OK).json(operations);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return res.status(HttpStatus.BAD_REQUEST).json({ message: errorMessage });
        }
    }

    async createGateOperation(req: Request, res: Response) {
        try {
            const performedBy = req.user?.name || req.user?.email || "System";
            const userContext = {
                userId: req.user?.id || 'unknown',
                userName: req.user?.name || req.user?.email || 'unknown',
                userRole: req.user?.role || 'unknown',
                ipAddress: req.ip || req.socket.remoteAddress || 'unknown'
            };
            await this.createGateOperationUseCase.execute(req.body, userContext, performedBy);

            // Real-time update
            console.log(`[Socket] Emitting KPI update for ${req.body.type} operation`);
            socketService.emitKPIUpdate({ type: 'GATE_OPERATION', data: req.body });
            
            console.log(`[Socket] Emitting activity for ${req.body.type} operation`);
            socketService.emitActivity({
                type: 'gate',
                title: 'New Gate Movement',
                description: `${req.body.containerNumber} - ${req.body.type}`,
                timestamp: new Date()
            });

            return res.status(HttpStatus.CREATED).json({ message: "Gate operation recorded successfully" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            return res.status(HttpStatus.BAD_REQUEST).json({ message: errorMessage });
        }
    }
}
