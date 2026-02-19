import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";

export class GetContainerHistory {
    constructor(private historyRepository: IContainerHistoryRepository) { }

    async execute(containerId: string): Promise<ContainerHistory[]> {
        return await this.historyRepository.findByContainerId(containerId);
    }
}
