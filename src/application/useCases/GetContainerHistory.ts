import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { IGetContainerHistory } from "../ports/IGetContainerHistory";
import { ContainerHistoryCollectionResponseDto } from "../dto/ContainerDto";
import { ContainerHistoryMapper } from "../mappers/ContainerHistoryMapper";
 
export class GetContainerHistory implements IGetContainerHistory {
    constructor(private historyRepository: IContainerHistoryRepository) { }
 
    async execute(containerId: string): Promise<ContainerHistoryCollectionResponseDto> {
        const history = await this.historyRepository.findByContainerId(containerId);
        return ContainerHistoryMapper.toCollectionResponseDto(history);
    }
}
