import { UserContextDto } from "../dto/CommonDto";

export interface IBlacklistContainer {
    execute(id: string, userContext?: UserContextDto): Promise<void>;
}
