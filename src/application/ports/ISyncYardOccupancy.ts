import { SyncYardOccupancyResponseDto } from "../dto/YardDto";

export interface ISyncYardOccupancy {
    execute(): Promise<SyncYardOccupancyResponseDto>;
}
