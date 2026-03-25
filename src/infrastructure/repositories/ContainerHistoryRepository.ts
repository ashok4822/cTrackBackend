import * as mongoose from "mongoose";
import { IContainerHistoryRepository, ContainerHistoryFilter } from "../../domain/repositories/IContainerHistoryRepository";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";
import { ContainerHistoryModel, IContainerHistoryDocument } from "../models/ContainerHistoryModel";

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
            containerId: typeof history.containerId === 'object' ? history.containerId._id : history.containerId,
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

    private toEntity(h: IContainerHistoryDocument): ContainerHistory {
        // Handle both populated and unpopulated containerId
        const containerId = h.containerId as unknown;
        
        let containerIdStr = "";
        let populatedData: { _id: string; containerNumber: string } | undefined;

        if (containerId && typeof containerId === 'object' && 'containerNumber' in containerId) {
            const pc = containerId as { _id: mongoose.Types.ObjectId | string; containerNumber: string };
            containerIdStr = pc._id.toString();
            populatedData = {
                _id: pc._id.toString(),
                containerNumber: pc.containerNumber
            };
        } else if (containerId) {
            containerIdStr = String(containerId);
        }

        const entity = new ContainerHistory(
            h._id.toString(),
            containerIdStr,
            h.activity,
            h.details,
            h.performedBy,
            h.timestamp,
            h.createdAt,
            h.updatedAt
        );

        if (populatedData) {
            entity.containerId = populatedData;
        }

        return entity;
    }

    async findRecent(filter: ContainerHistoryFilter, limit: number): Promise<ContainerHistory[]> {
        const histories = await ContainerHistoryModel.find(filter)
            .sort({ timestamp: -1 as const })
            .limit(limit)
            .populate("containerId", "containerNumber");
        return histories.map(h => this.toEntity(h));
    }
}
