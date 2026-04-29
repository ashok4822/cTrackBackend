import { Container } from "../entities/Container";

export interface GateInContainerData {
  containerNumber?: string;
  size?: "20ft" | "40ft";
  containerType?: "standard" | "reefer" | "tank" | "open-top";
  shippingLine?: string;
  empty?: boolean;
  movementType?: "import" | "export" | "domestic";
  customer?: string;
  weight?: number;
  cargoWeight?: number;
  cargoDescription?: string;
  hazardousClassification?: boolean;
  sealNumber?: string;
  cargoCategory?: string;
}

export interface IContainerDomainService {
  findByNumber(containerNumber: string): Promise<Container | null>;
  getCustomerName(customerId: string): Promise<string>;
  processGateIn(data: GateInContainerData, existingContainer: Container | null): Promise<Container>;
  processGateOut(container: Container): Promise<Container>;
}
