import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { PDA } from "../../domain/entities/PDA";

export class GetPDA {
    constructor(
        private pdaRepository: IPDARepository,
        private userRepository: IUserRepository
    ) { }

    async execute(userId: string, role: string): Promise<any> {
        if (role === 'admin' || role === 'operator') {
            const pdas = await this.pdaRepository.findAll();
            return await Promise.all(pdas.map(async (pda) => {
                const transactions = await this.pdaRepository.findTransactionsByPdaId(pda.id);
                return { ...pda, transactions };
            }));
        }

        let pda = await this.pdaRepository.findByUserId(userId);

        // If PDA doesn't exist for customer, create it on first access
        if (!pda) {
            const user = await this.userRepository.findById(userId);
            if (user && user.role === 'customer') {
                pda = await this.pdaRepository.create({
                    userId,
                    customer: user.companyName || user.name || 'Unknown',
                    balance: 0
                });
            }
        }

        if (pda) {
            const transactions = await this.pdaRepository.findTransactionsByPdaId(pda.id);
            return { ...pda, transactions };
        }

        return null;
    }
}
