import { Request, Response } from "express";
import { CreateEquipment } from "../../application/useCases/CreateEquipment";
import { UpdateEquipment } from "../../application/useCases/UpdateEquipment";
import { DeleteEquipment } from "../../application/useCases/DeleteEquipment";
import { GetAllEquipment } from "../../application/useCases/GetAllEquipment";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class EquipmentController {
    constructor(
        private createEquipment: CreateEquipment,
        private updateEquipment: UpdateEquipment,
        private deleteEquipment: DeleteEquipment,
        private getAllEquipment: GetAllEquipment
    ) { }

    async fetchAll(req: Request, res: Response) {
        try {
            const filters = req.query as any;
            const equipment = await this.getAllEquipment.execute(filters);
            res.status(HttpStatus.OK).json(equipment);
        } catch (error: any) {
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const equipment = await this.createEquipment.execute(req.body);
            res.status(HttpStatus.CREATED).json(equipment);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const equipment = await this.updateEquipment.execute(id as string, req.body);
            res.status(HttpStatus.OK).json(equipment);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.deleteEquipment.execute(id as string);
            res.status(HttpStatus.OK).json({ message: "Equipment deleted" });
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}
