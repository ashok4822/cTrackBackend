import { Request, Response } from "express";
import { IGetBlocks } from "../../application/ports/IGetBlocks";
import { ICreateBlock } from "../../application/ports/ICreateBlock";
import { IUpdateBlock } from "../../application/ports/IUpdateBlock";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";
import { asyncHandler } from "../middlewares/asyncHandler";
import { extractUserContext } from "../utils/userContext";
import { ApiResponse } from "../../shared/utils/ApiResponse";

export class YardController {
    constructor(
        private readonly _getBlocksUseCase: IGetBlocks,
        private readonly _createBlockUseCase: ICreateBlock,
        private readonly _updateBlockUseCase: IUpdateBlock,
    ) { }

    getBlocks = asyncHandler(async (req: Request, res: Response) => {
        const blocks = await this._getBlocksUseCase.execute();
        return res.status(HttpStatus.OK).json(ApiResponse.success(blocks));
    });

    updateBlock = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, capacity } = req.body;
        const userContext = extractUserContext(req);
        await this._updateBlockUseCase.execute(id as string, { name, capacity }, userContext);

        return res.status(HttpStatus.OK).json(ApiResponse.success(null, ResponseMessage.BLOCK_UPDATED));
    });

    createBlock = asyncHandler(async (req: Request, res: Response) => {
        const { name, capacity } = req.body;
        const userContext = extractUserContext(req);
        await this._createBlockUseCase.execute({ name, capacity }, userContext);

        return res.status(HttpStatus.CREATED).json(ApiResponse.success(null, ResponseMessage.BLOCK_CREATED));
    });
}

