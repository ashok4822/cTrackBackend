export class CreateBlockRequestDto {
  name!: string;
  capacity!: number;
}

export class UpdateBlockRequestDto {
  name?: string;
  capacity?: number;
  occupied?: number;
}

export class BlockResponseDto {
  id!: string;
  name!: string;
  capacity!: number;
  occupied!: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class BlockCollectionResponseDto {
  items!: BlockResponseDto[];
  total!: number;
}

export class SyncResultDto {
  block!: string;
  oldOccupied!: number;
  newOccupied!: number;
}

export class SyncYardOccupancyResponseDto {
  message!: string;
  results!: SyncResultDto[];
}
