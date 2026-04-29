import { Block } from "../../domain/entities/Block";
import { 
  CreateBlockRequestDto,
  UpdateBlockRequestDto,
  BlockResponseDto, 
  BlockCollectionResponseDto,
  SyncYardOccupancyResponseDto,
  SyncResultDto
} from "../dto/YardDto";

export class YardMapper {
  static toEntity(dto: CreateBlockRequestDto): Block {
    return new Block(
      "", // id will be generated
      dto.name,
      dto.capacity,
      0 // occupied starts at 0
    );
  }

  /** Apply a partial update to an existing Block entity */
  static applyUpdate(existing: Block, data: UpdateBlockRequestDto): Block {
    return new Block(
      existing.id,
      data.name !== undefined ? data.name : existing.name,
      data.capacity !== undefined ? data.capacity : existing.capacity,
      data.occupied !== undefined ? data.occupied : existing.occupied
    );
  }

  static toResponseDto(block: Block): BlockResponseDto {
    return {
      id: block.id,
      name: block.name,
      capacity: block.capacity,
      occupied: block.occupied,
      createdAt: block.createdAt,
      updatedAt: block.updatedAt,
    };
  }

  static toCollectionResponseDto(blocks: Block[]): BlockCollectionResponseDto {
    return {
      items: blocks.map(b => this.toResponseDto(b)),
      total: blocks.length,
    };
  }

  static toSyncResponseDto(message: string, results: SyncResultDto[]): SyncYardOccupancyResponseDto {
    return { message, results };
  }
}
