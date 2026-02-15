import { Request, Response } from "express";
import { CreateShippingLine } from "../../application/useCases/CreateShippingLine";
import { GetAllShippingLines } from "../../application/useCases/GetAllShippingLines";
import { UpdateShippingLine } from "../../application/useCases/UpdateShippingLine";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class ShippingLineController {
    constructor(
        private createShippingLineUseCase: CreateShippingLine,
        private getAllShippingLinesUseCase: GetAllShippingLines,
        private updateShippingLineUseCase: UpdateShippingLine
    ) { }

    async createShippingLine(req: Request, res: Response) {
        try {
            const { name, code } = req.body;
            await this.createShippingLineUseCase.execute(name, code);
            return res.status(HttpStatus.CREATED).json({ message: "Shipping Line created successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async getAllShippingLines(req: Request, res: Response) {
        try {
            const shippingLines = await this.getAllShippingLinesUseCase.execute();
            return res.status(HttpStatus.OK).json(shippingLines);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async updateShippingLine(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, code } = req.body;
            await this.updateShippingLineUseCase.execute(id as string, { name, code });
            return res.status(HttpStatus.OK).json({ message: "Shipping Line updated successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}
