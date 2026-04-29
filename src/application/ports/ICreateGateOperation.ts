import { CreateGateOperationRequestDto } from "../dto/GateDto";
import { UserContextDto } from "../dto/CommonDto";

export interface ICreateGateOperation {
  execute(
    data: CreateGateOperationRequestDto,
    userContext?: UserContextDto,
    performedBy?: string
  ): Promise<void>;
}
