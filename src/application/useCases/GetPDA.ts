import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetPDA } from "../ports/IGetPDA";
import { IConfigService } from "../services/IConfigService";
import { PDAResponseDto } from "../dto/PDADto";
import { PDAMapper } from "../mappers/PDAMapper";

export class GetPDA implements IGetPDA {
  constructor(
    private readonly _pdaRepository: IPDARepository,
    private readonly _userRepository: IUserRepository,
    private readonly _configService: IConfigService,
  ) {}

  async execute(
    userId: string,
    role: string,
  ): Promise<PDAResponseDto[] | PDAResponseDto | null> {
    const lowBalanceThreshold = this._configService.getNumber('PDA_LOW_BALANCE_THRESHOLD');

    if (role === "admin" || role === "operator") {
      const pdas = await this._pdaRepository.findAll();
      return await Promise.all(
        pdas.map(async (pda) => {
          const transactions = await this._pdaRepository.findTransactionsByPdaId(
            pda.id,
          );
          return PDAMapper.toPDAResponseDto(pda, transactions, lowBalanceThreshold);
        }),
      );
    }

    let pda = await this._pdaRepository.findByUserId(userId);

    // If PDA doesn't exist for customer, create it on first access
    if (!pda) {
      const user = await this._userRepository.findById(userId);
      if (user && user.role === "customer") {
        pda = await this._pdaRepository.create({
          userId,
          customer: user.companyName || user.name || "Unknown",
          balance: 0,
        });
      }
    }

    if (pda) {
      const transactions = await this._pdaRepository.findTransactionsByPdaId(
        pda.id,
      );
      return PDAMapper.toPDAResponseDto(pda, transactions, lowBalanceThreshold);
    }

    return null;
  }
}
