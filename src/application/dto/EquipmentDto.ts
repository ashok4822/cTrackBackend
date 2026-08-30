import { BaseFilterDto } from "./CommonDto";

export class CreateEquipmentRequestDto {
  name!: string;
  type!: "reach-stacker" | "forklift" | "crane";
  status!: "operational" | "maintenance" | "down" | "idle";
  operator?: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
}

export class UpdateEquipmentRequestDto {
  name?: string;
  type?: "reach-stacker" | "forklift" | "crane";
  status?: "operational" | "maintenance" | "down" | "idle";
  operator?: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
}

export class EquipmentFiltersDto extends BaseFilterDto {
  type?: string;
  status?: string;
  name?: string;
}

export class EquipmentResponseDto {
  id!: string | null;
  name!: string;
  type!: string;
  status!: string;
  operator?: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EquipmentCollectionResponseDto {
  items!: EquipmentResponseDto[];
  total!: number;
}

export class EquipmentHistoryResponseDto {
  id!: string | null;
  equipmentId!: string;
  activity!: string;
  details!: string | null;
  performedBy!: string | null;
  timestamp!: Date | null;
}

export class EquipmentHistoryCollectionResponseDto {
  items!: EquipmentHistoryResponseDto[];
  total!: number;
}
