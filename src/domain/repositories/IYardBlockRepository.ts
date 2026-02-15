import { YardBlock } from "../entities/YardBlock";

export interface IYardBlockRepository {
    findAll(): Promise<YardBlock[]>;
    findById(id: string): Promise<YardBlock | null>;
    save(yardBlock: YardBlock): Promise<void>;
}
