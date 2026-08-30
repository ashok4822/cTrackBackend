export class CreateGateOperationRequestDto {
  type!: "gate-in" | "gate-out";
  containerNumber?: string;
  vehicleNumber!: string;
  driverName!: string;
  driverPhone?: string;
  vehicleType?: string;
  purpose!: "port" | "factory" | "transfer";
  remarks?: string;
  cargoCategory?: string;
  size?: "20ft" | "40ft";
  containerType?: "standard" | "reefer" | "tank" | "open-top";
  shippingLine?: string;
  weight?: number;
  cargoWeight?: number;
  cargoDescription?: string;
  hazardousClassification?: boolean;
  sealNumber?: string;
  empty?: boolean;
  movementType?: "import" | "export" | "domestic";
  customer?: string;
  approvedBy?: string;
}

export class GateOperationResponseDto {
  id!: string | null;
  type!: "gate-in" | "gate-out";
  containerNumber?: string;
  vehicleNumber!: string;
  driverName!: string;
  purpose!: "port" | "factory" | "transfer";
  timestamp!: Date;
  approvedBy?: string;
  remarks?: string;
  cargoCategory?: string;
}

export class GateOperationCollectionResponseDto {
  items!: GateOperationResponseDto[];
  total!: number;
}
