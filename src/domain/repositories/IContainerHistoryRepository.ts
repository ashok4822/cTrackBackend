import { ContainerHistory } from "../entities/ContainerHistory";

export interface ContainerHistoryFilter {
    containerId?: string | { $in: string[] };
    activity?: string;
    performedBy?: string;
}

export interface IContainerHistoryRepository {
    findByContainerId(containerId: string): Promise<ContainerHistory[]>;
    save(history: ContainerHistory): Promise<void>;
    findRecent(filter: ContainerHistoryFilter, limit: number): Promise<ContainerHistory[]>;
}
