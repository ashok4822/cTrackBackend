export interface CreateBlockRequestDto {
  name: string;
  capacity: number;
}

export interface UpdateBlockRequestDto {
  name?: string;
  capacity?: number;
  occupied?: number;
}

export interface BlockResponseDto {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlockCollectionResponseDto {
  items: BlockResponseDto[];
  total: number;
}

export interface SyncResultDto {
  block: string;
  oldOccupied: number;
  newOccupied: number;
}

export interface SyncYardOccupancyResponseDto {
  message: string;
  results: SyncResultDto[];
}
