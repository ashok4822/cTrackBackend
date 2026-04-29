import { ContainerHistory, ContainerSummary } from "../../domain/entities/ContainerHistory";
import { ContainerHistoryResponseDto, ContainerHistoryCollectionResponseDto } from "../dto/ContainerDto";

export class ContainerHistoryMapper {
  static toResponseDto(entity: ContainerHistory): ContainerHistoryResponseDto {
    const containerId = typeof entity.containerId === "string" 
      ? entity.containerId 
      : (entity.containerId as ContainerSummary).id;
    
    const containerNumber = typeof entity.containerId === "string" 
      ? undefined 
      : (entity.containerId as ContainerSummary).containerNumber;

    return {
      id: entity.id,
      containerId,
      containerNumber,
      activity: entity.activity,
      details: entity.details,
      performedBy: entity.performedBy,
      timestamp: entity.timestamp,
    };
  }

  static toCollectionResponseDto(entities: ContainerHistory[]): ContainerHistoryCollectionResponseDto {
    return {
      items: entities.map((e) => this.toResponseDto(e)),
      total: entities.length,
    };
  }
}
