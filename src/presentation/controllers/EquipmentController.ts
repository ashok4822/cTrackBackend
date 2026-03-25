import { Request, Response } from "express";
import { CreateEquipment } from "../../application/useCases/CreateEquipment";
import { UpdateEquipment } from "../../application/useCases/UpdateEquipment";
import { DeleteEquipment } from "../../application/useCases/DeleteEquipment";
import { GetAllEquipment } from "../../application/useCases/GetAllEquipment";
import { GetEquipmentHistory } from "../../application/useCases/GetEquipmentHistory";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class EquipmentController {
    constructor(
        private createEquipment: CreateEquipment,
        private updateEquipment: UpdateEquipment,
        private deleteEquipment: DeleteEquipment,
        private getAllEquipment: GetAllEquipment,
        private getEquipmentHistory: GetEquipmentHistory
    ) { }

    async fetchAll(req: Request, res: Response) {
        try {
            const filters = req.query as {
                type?: string;
                status?: string;
                name?: string;
            };
            const equipment = await this.getAllEquipment.execute(filters);
            res.status(HttpStatus.OK).json(equipment);
        } catch (error: unknown) {
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const performedBy = req.user?.name || req.user?.email || "System";
            const equipment = await this.createEquipment.execute(req.body, performedBy);
            res.status(HttpStatus.CREATED).json(equipment);
        } catch (error: unknown) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "Bad Request" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const performedBy = req.user?.name || req.user?.email || "System";
            const equipment = await this.updateEquipment.execute(id as string, req.body, performedBy);
            res.status(HttpStatus.OK).json(equipment);
        } catch (error: unknown) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "Bad Request" });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.deleteEquipment.execute(id as string);
            res.status(HttpStatus.OK).json({ message: "Equipment deleted" });
        } catch (error: unknown) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "Bad Request" });
        }
    }

    async fetchHistory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const history = await this.getEquipmentHistory.execute(id as string);
            res.status(HttpStatus.OK).json(history);
        } catch (error: unknown) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error instanceof Error ? error.message : "Internal server error" });
        }
    }
}
