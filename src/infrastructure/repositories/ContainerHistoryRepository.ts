import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";
import { ContainerHistoryModel } from "../models/ContainerHistoryModel";

export class ContainerHistoryRepository implements IContainerHistoryRepository {
    async findByContainerId(containerId: string): Promise<ContainerHistory[]> {
        const histories = await ContainerHistoryModel.find({ containerId }).sort({ timestamp: -1 });
        return histories.map(h => new ContainerHistory(
            h._id.toString(),
            h.containerId.toString(),
            h.activity,
            h.details,
            h.performedBy,
            h.timestamp,
            h.createdAt,
            h.updatedAt
        ));
    }

    async save(history: ContainerHistory): Promise<void> {
        const historyData = {
            containerId: history.containerId,
            activity: history.activity,
            details: history.details,
            performedBy: history.performedBy,
            timestamp: history.timestamp || new Date()
        };

        if (history.id) {
            await ContainerHistoryModel.findByIdAndUpdate(history.id, historyData);
        } else {
            await ContainerHistoryModel.create(historyData);
        }
    }
}
