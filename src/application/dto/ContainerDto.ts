import { BaseFilterDto } from "./CommonDto";

export class CreateContainerRequestDto {
  containerNumber!: string;
  size!: "20ft" | "40ft";
  type!: "standard" | "reefer" | "tank" | "open-top";
  status!: "pending" | "gate-in" | "in-yard" | "in-transit" | "at-port" | "at-factory" | "gate-out" | "damaged";
  shippingLine!: string;
  movementType?: "import" | "export" | "domestic";
  customer?: string;
  weight?: number;
  sealNumber?: string;
}

export class UpdateContainerRequestDto {
  id!: string;
  containerNumber?: string;
  size?: "20ft" | "40ft";
  type?: "standard" | "reefer" | "tank" | "open-top";
  status?: "pending" | "gate-in" | "in-yard" | "in-transit" | "at-port" | "at-factory" | "gate-out" | "damaged";
  shippingLine?: string;
  movementType?: "import" | "export" | "domestic";
  customer?: string;
  weight?: number;
  sealNumber?: string;
  equipmentName?: string;
  performedBy?: string;
  yardLocation?: { block: string };
}

export class ContainerFiltersDto extends BaseFilterDto {
  containerNumber?: string | string[];
  size?: string | string[];
  type?: string | string[];
  block?: string | string[];
  status?: string | string[];
  customer?: string | string[];
  empty?: boolean;
  isHazardous?: boolean;
  damaged?: boolean;
  blacklisted?: boolean;
}

export class ContainerResponseDto {
  id!: string | null;
  containerNumber!: string;
  size!: string;
  type!: string;
  status!: string;
  shippingLine!: string;
  customer?: string;
  customerName?: string;
  yardLocation?: { block: string };
  gateInTime?: Date;
  gateOutTime?: Date;
  dwellTime?: number;
  weight?: number;
  sealNumber?: string;
  empty?: boolean;
  damaged?: boolean;
  damageDetails?: string;
  blacklisted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContainerCollectionResponseDto {
  items!: ContainerResponseDto[];
  total!: number;
}
export class ContainerHistoryResponseDto {
  id!: string | null;
  containerId!: string;
  containerNumber?: string;
  activity!: string;
  details?: string;
  performedBy?: string;
  timestamp?: Date;
}

export class ContainerHistoryCollectionResponseDto {
  items!: ContainerHistoryResponseDto[];
  total!: number;
}
