import { PDAResponseDto } from "../dto/PDADto";

export interface IGetPDA {
  execute(
    userId: string,
    role: string,
  ): Promise<PDAResponseDto[] | PDAResponseDto | null>;
}
