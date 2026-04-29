export interface CreateContainerRequestDto {
  customerId?: string;
  type: "stuffing" | "destuffing";
  cargoCategoryId?: string;
  cargoCategoryName?: string;
  containerSize?: string;
  containerType?: string;
  cargoDescription?: string;
  cargoWeight?: number;
  preferredDate?: Date;
  specialInstructions?: string;
  isHazardous?: boolean;
  hazardClass?: string;
  unNumber?: string;
  packingGroup?: string;
  containerId?: string;
  containerNumber?: string;
  remarks?: string;
}

export interface UpdateContainerRequestDto {
  status?: "approved" | "rejected" | "completed" | "ready-for-dispatch" | "in-transit" | "at-factory" | "operation-completed" | "cancelled";
  remarks?: string;
  cargoCharge?: number;
  cargoCategoryId?: string;
  cargoCategoryName?: string;
  equipmentId?: string;
  containerNumber?: string;
  containerId?: string;
  checkpoints?: Array<{ location: string, timestamp: Date, status: string, remarks?: string }>;
}

export interface ContainerRequestResponseDto {
  id: string | null;
  customerId: string;
  customerName?: string;
  type: "stuffing" | "destuffing";
  status: string;
  cargoCategoryId?: string;
  cargoCategoryName?: string;
  containerSize?: string;
  containerType?: string;
  cargoDescription?: string;
  cargoWeight?: number;
  preferredDate?: Date;
  specialInstructions?: string;
  isHazardous?: boolean;
  hazardClass?: string;
  unNumber?: string;
  packingGroup?: string;
  containerId?: string;
  containerNumber?: string;
  remarks?: string;
  checkpoints?: Array<{ location: string, timestamp: Date, status: string, remarks?: string }>;
  cargoCharge?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContainerRequestCollectionResponseDto {
  items: ContainerRequestResponseDto[];
  total: number;
}
