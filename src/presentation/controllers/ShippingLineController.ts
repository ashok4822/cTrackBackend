import { Request, Response } from "express";
import { CreateShippingLine } from "../../application/useCases/CreateShippingLine";
import { GetAllShippingLines } from "../../application/useCases/GetAllShippingLines";
import { UpdateShippingLine } from "../../application/useCases/UpdateShippingLine";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { UserContext } from "../../application/useCases/AdminCreateUser";

export class ShippingLineController {
    constructor(
        private createShippingLineUseCase: CreateShippingLine,
        private getAllShippingLinesUseCase: GetAllShippingLines,
        private updateShippingLineUseCase: UpdateShippingLine
    ) { }

    private getUserContext(req: Request): UserContext {
        const user = (req as any).user;
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';
        return {
            userId: user?.id || 'unknown',
            userName: user?.name || user?.email || 'unknown',
            userRole: user?.role || 'unknown',
            ipAddress
        };
    }

    async createShippingLine(req: Request, res: Response) {
        try {
            const { name, code } = req.body;
            const userContext = this.getUserContext(req);
            await this.createShippingLineUseCase.execute(name, code, userContext);
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
            const userContext = this.getUserContext(req);
            await this.updateShippingLineUseCase.execute(id as string, { name, code }, userContext);
            return res.status(HttpStatus.OK).json({ message: "Shipping Line updated successfully" });
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
}
