// ─── Activity DTOs ────────────────────────────────────────────────────────────

export type ActivityCategory = "handling" | "storage" | "stuffing" | "transport" | "other";
export type ActivityUnitType = "per-container" | "per-day" | "per-hour" | "per-teu" | "fixed";

export class CreateActivityRequestDto {
  code!: string;
  name!: string;
  description!: string;
  category!: ActivityCategory;
  unitType!: ActivityUnitType;
}

export class UpdateActivityRequestDto {
  code?: string;
  name?: string;
  description?: string;
  category?: ActivityCategory;
  unitType?: ActivityUnitType;
  active?: boolean;
}

export class ActivityResponseDto {
  id!: string | null;
  code!: string;
  name!: string;
  description!: string;
  category!: ActivityCategory;
  unitType!: ActivityUnitType;
  active!: boolean;
}

export class ActivityCollectionResponseDto {
  items!: ActivityResponseDto[];
  total!: number;
}
