import { UserContextDto } from "../dto/CommonDto";

export interface IUnblacklistContainer {
    execute(id: string, userContext?: UserContextDto): Promise<void>;
}
