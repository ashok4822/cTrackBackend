import { Request, Response } from "express";
import { GetAllEquipment } from "../../application/useCases/GetAllEquipment";
import { AddEquipment } from "../../application/useCases/AddEquipment";
import { UpdateEquipment } from "../../application/useCases/UpdateEquipment";
import { DeleteEquipment } from "../../application/useCases/DeleteEquipment";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class EquipmentController {
    constructor(
        private getAllEquipmentUseCase: GetAllEquipment,
        private addEquipmentUseCase: AddEquipment,
        private updateEquipmentUseCase: UpdateEquipment,
        private deleteEquipmentUseCase: DeleteEquipment
    ) { }

    async getAllEquipment(req: Request, res: Response) {
        try {
            const { type, status, name } = req.query;
            const equipment = await this.getAllEquipmentUseCase.execute({
                type: type as any,
                status: status as any,
                name: name as string,
            });
            return res.status(HttpStatus.OK).json(equipment);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async addEquipment(req: Request, res: Response) {
        try {
            await this.addEquipmentUseCase.execute(req.body);
            return res.status(HttpStatus.CREATED).json({ message: "Equipment added successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async updateEquipment(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await this.updateEquipmentUseCase.execute(id, req.body);
            return res.status(HttpStatus.OK).json({ message: "Equipment updated successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async deleteEquipment(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await this.deleteEquipmentUseCase.execute(id);
            return res.status(HttpStatus.OK).json({ message: "Equipment deleted successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}
