import { Activity } from "../../domain/entities/Activity";
import {
  ActivityResponseDto,
  ActivityCollectionResponseDto,
  CreateActivityRequestDto,
} from "../dto/ActivityDto";

export class ActivityMapper {
  static toResponseDto(entity: Activity): ActivityResponseDto {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      category: entity.category,
      unitType: entity.unitType,
      active: entity.active,
    };
  }

  static toCollectionResponseDto(entities: Activity[]): ActivityCollectionResponseDto {
    return {
      items: entities.map((e) => this.toResponseDto(e)),
      total: entities.length,
    };
  }

  static toEntity(dto: CreateActivityRequestDto): Activity {
    return new Activity(null, dto.code, dto.name, dto.description, dto.category, dto.unitType, true);
  }
}
