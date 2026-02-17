import { ContainerHistory } from "../entities/ContainerHistory";

export interface IContainerHistoryRepository {
    findByContainerId(containerId: string): Promise<ContainerHistory[]>;
    save(history: ContainerHistory): Promise<void>;
}
