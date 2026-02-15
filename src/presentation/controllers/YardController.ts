import { Request, Response } from "express";
import { GetYardBlocks } from "../../application/useCases/GetYardBlocks";
import { CreateYardBlock } from "../../application/useCases/CreateYardBlock";
import { UpdateYardBlock } from "../../application/useCases/UpdateYardBlock";
import { HttpStatus } from "../../domain/constants/HttpStatus";

export class YardController {
    constructor(
        private getYardBlocksUseCase: GetYardBlocks,
        private createYardBlockUseCase: CreateYardBlock,
        private updateYardBlockUseCase: UpdateYardBlock
    ) { }

    async getYardBlocks(req: Request, res: Response) {
        try {
            const blocks = await this.getYardBlocksUseCase.execute();
            return res.status(HttpStatus.OK).json(blocks);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || "Failed to fetch yard blocks",
            });
        }
    }

    async updateYardBlock(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, capacity } = req.body;
            await this.updateYardBlockUseCase.execute(id as string, { name, capacity });
            return res.status(HttpStatus.OK).json({
                message: "Yard block updated successfully",
            });
        } catch (error: any) {
            const status = error.message === "Yard block not found"
                ? HttpStatus.NOT_FOUND
                : HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                message: error.message || "Failed to update yard block",
            });
        }
    }

    async createYardBlock(req: Request, res: Response) {
        try {
            const { name, capacity } = req.body;
            await this.createYardBlockUseCase.execute({ name, capacity });
            return res.status(HttpStatus.CREATED).json({
                message: "Yard block created successfully",
            });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || "Failed to create yard block",
            });
        }
    }
}
