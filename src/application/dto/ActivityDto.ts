// ─── Activity DTOs ────────────────────────────────────────────────────────────

export type ActivityCategory = "handling" | "storage" | "stuffing" | "transport" | "other";
export type ActivityUnitType = "per-container" | "per-day" | "per-hour" | "per-teu" | "fixed";

export interface CreateActivityRequestDto {
  code: string;
  name: string;
  description: string;
  category: ActivityCategory;
  unitType: ActivityUnitType;
}

export interface UpdateActivityRequestDto {
  code?: string;
  name?: string;
  description?: string;
  category?: ActivityCategory;
  unitType?: ActivityUnitType;
  active?: boolean;
}

export interface ActivityResponseDto {
  id: string | null;
  code: string;
  name: string;
  description: string;
  category: ActivityCategory;
  unitType: ActivityUnitType;
  active: boolean;
}

export interface ActivityCollectionResponseDto {
  items: ActivityResponseDto[];
  total: number;
}
