import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { IGetContainerHistory } from "../ports/IGetContainerHistory";
import { ContainerHistoryCollectionResponseDto } from "../dto/ContainerDto";
import { ContainerHistoryMapper } from "../mappers/ContainerHistoryMapper";
 
export class GetContainerHistory implements IGetContainerHistory {
    constructor(private readonly _historyRepository: IContainerHistoryRepository) { }
 
    async execute(containerId: string): Promise<ContainerHistoryCollectionResponseDto> {
        const history = await this._historyRepository.findByContainerId(containerId);
        return ContainerHistoryMapper.toCollectionResponseDto(history);
    }
}
