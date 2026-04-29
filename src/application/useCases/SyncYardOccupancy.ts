import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { ISyncYardOccupancy } from "../ports/ISyncYardOccupancy";
import { SyncYardOccupancyResponseDto, SyncResultDto } from "../dto/YardDto";
import { YardMapper } from "../mappers/YardMapper";

export class SyncYardOccupancy implements ISyncYardOccupancy {
    constructor(
        private blockRepository: IBlockRepository,
        private containerRepository: IContainerRepository
    ) { }

    async execute(): Promise<SyncYardOccupancyResponseDto> {
        const blocks = await this.blockRepository.findAll();
        const results: SyncResultDto[] = [];

        for (const block of blocks) {
            const containerCount = await this.containerRepository.countByBlockNameAndStatuses(
                block.name,
                ['gate-in', 'in-yard', 'damaged']
            );

            const oldOccupied = block.occupied;
            await this.blockRepository.updateOccupied(block.id!, containerCount);

            results.push({
                block: block.name,
                oldOccupied,
                newOccupied: containerCount
            });
        }

        return YardMapper.toSyncResponseDto("Yard occupancy synchronized successfully", results);
    }
}
