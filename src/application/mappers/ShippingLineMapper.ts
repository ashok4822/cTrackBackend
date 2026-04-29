import { ShippingLine } from "../../domain/entities/ShippingLine";
import { 
  CreateShippingLineRequestDto,
  UpdateShippingLineRequestDto,
  ShippingLineResponseDto, 
  ShippingLineCollectionResponseDto 
} from "../dto/ShippingLineDto";

export class ShippingLineMapper {
  static toEntity(dto: CreateShippingLineRequestDto): ShippingLine {
    return new ShippingLine(
      null,
      dto.name,
      dto.code || ""
    );
  }

  /** Apply an update to an existing ShippingLine entity */
  static applyUpdate(existing: ShippingLine, data: UpdateShippingLineRequestDto): ShippingLine {
    return new ShippingLine(
      existing.id,
      data.name !== undefined ? data.name : existing.shipping_line_name,
      data.code !== undefined ? data.code : existing.shipping_line_code
    );
  }

  static toResponseDto(entity: ShippingLine): ShippingLineResponseDto {
    return {
      id: entity.id || "",
      name: entity.shipping_line_name,
      code: entity.shipping_line_code,
    };
  }

  static toCollectionResponseDto(entities: ShippingLine[]): ShippingLineCollectionResponseDto {
    return {
      items: entities.map(e => this.toResponseDto(e)),
      total: entities.length,
    };
  }
}
