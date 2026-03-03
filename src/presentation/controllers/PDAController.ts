import { Request, Response } from "express";
import { GetPDA } from "../../application/useCases/GetPDA";
import { DepositFunds } from "../../application/useCases/DepositFunds";

export class PDAController {
    constructor(
        private getPDAUseCase: GetPDA,
        private depositFundsUseCase: DepositFunds
    ) { }

    async getPDA(req: Request, res: Response): Promise<void> {
        try {
            const { id: userId, role } = (req as any).user;
            const result = await this.getPDAUseCase.execute(userId, role);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async depositFunds(req: Request, res: Response): Promise<void> {
        try {
            const { id: userId } = (req as any).user;
            const { amount, description } = req.body;
            const result = await this.depositFundsUseCase.execute(userId, amount, description);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
