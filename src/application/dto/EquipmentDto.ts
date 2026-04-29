import { BaseFilterDto } from "./CommonDto";

export interface CreateEquipmentRequestDto {
  name: string;
  type: "reach-stacker" | "forklift" | "crane";
  status: "operational" | "maintenance" | "down" | "idle";
  operator?: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
}

export interface UpdateEquipmentRequestDto {
  name?: string;
  type?: "reach-stacker" | "forklift" | "crane";
  status?: "operational" | "maintenance" | "down" | "idle";
  operator?: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
}

export interface EquipmentFiltersDto extends BaseFilterDto {
  type?: string;
  status?: string;
  name?: string;
}

export interface EquipmentResponseDto {
  id: string | null;
  name: string;
  type: string;
  status: string;
  operator?: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EquipmentCollectionResponseDto {
  items: EquipmentResponseDto[];
  total: number;
}

export interface EquipmentHistoryResponseDto {
  id: string | null;
  equipmentId: string;
  activity: string;
  details: string | null;
  performedBy: string | null;
  timestamp: Date | null;
}

export interface EquipmentHistoryCollectionResponseDto {
  items: EquipmentHistoryResponseDto[];
  total: number;
}
