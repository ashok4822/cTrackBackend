import { CargoCategory } from "../../domain/entities/CargoCategory";
import { 
  CreateCargoCategoryRequestDto,
  CargoCategoryResponseDto, 
  CargoCategoryCollectionResponseDto 
} from "../dto/CargoDto";

export class CargoMapper {
  static toEntity(dto: CreateCargoCategoryRequestDto): CargoCategory {
    return new CargoCategory(
      null,
      dto.name,
      dto.description,
      true, // active
      dto.chargePerTon
    );
  }

  static toResponseDto(entity: CargoCategory): CargoCategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      chargePerTon: entity.chargePerTon,
      active: entity.active,
    };
  }

  static toCollectionResponseDto(entities: CargoCategory[]): CargoCategoryCollectionResponseDto {
    return {
      items: entities.map(e => this.toResponseDto(e)),
      total: entities.length,
    };
  }
}
