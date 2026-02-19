import { Request, Response } from "express";
import { GetBlocks } from "../../application/useCases/GetBlocks";
import { CreateBlock } from "../../application/useCases/CreateBlock";
import { UpdateBlock } from "../../application/useCases/UpdateBlock";
import { HttpStatus } from "../../domain/constants/HttpStatus";
import { UserContext } from "../../application/useCases/AdminCreateUser";

export class YardController {
    constructor(
        private getBlocksUseCase: GetBlocks,
        private createBlockUseCase: CreateBlock,
        private updateBlockUseCase: UpdateBlock
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

    async getBlocks(req: Request, res: Response) {
        try {
            const blocks = await this.getBlocksUseCase.execute();
            return res.status(HttpStatus.OK).json(blocks);
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || "Failed to fetch blocks",
            });
        }
    }

    async updateBlock(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, capacity } = req.body;
            const userContext = this.getUserContext(req);
            await this.updateBlockUseCase.execute(id as string, { name, capacity }, userContext);
            return res.status(HttpStatus.OK).json({
                message: "Block updated successfully",
            });
        } catch (error: any) {
            const status = error.message === "Block not found"
                ? HttpStatus.NOT_FOUND
                : HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                message: error.message || "Failed to update block",
            });
        }
    }

    async createBlock(req: Request, res: Response) {
        try {
            const { name, capacity } = req.body;
            const userContext = this.getUserContext(req);
            await this.createBlockUseCase.execute({ name, capacity }, userContext);
            return res.status(HttpStatus.CREATED).json({
                message: "Block created successfully",
            });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message || "Failed to create block",
            });
        }
    }
}
