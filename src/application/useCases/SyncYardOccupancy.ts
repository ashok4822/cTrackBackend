import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { ISyncYardOccupancy } from "../ports/ISyncYardOccupancy";
import { SyncYardOccupancyResponseDto, SyncResultDto } from "../dto/YardDto";
import { YardMapper } from "../mappers/YardMapper";

export class SyncYardOccupancy implements ISyncYardOccupancy {
    constructor(
        private readonly _blockRepository: IBlockRepository,
        private readonly _containerRepository: IContainerRepository
    ) { }

    async execute(): Promise<SyncYardOccupancyResponseDto> {
        const blocks = await this._blockRepository.findAll();
        const results: SyncResultDto[] = [];

        for (const block of blocks) {
            const containerCount = await this._containerRepository.countByBlockNameAndStatuses(
                block.name,
                ['gate-in', 'in-yard', 'damaged']
            );

            const oldOccupied = block.occupied;
            await this._blockRepository.updateOccupied(block.id!, containerCount);

            results.push({
                block: block.name,
                oldOccupied,
                newOccupied: containerCount
            });
        }

        return YardMapper.toSyncResponseDto("Yard occupancy synchronized successfully", results);
    }
}
