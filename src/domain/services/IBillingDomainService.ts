import { ContainerRequest } from "../entities/ContainerRequest";

export interface IBillingDomainService {
  /**
   * Generates or updates a bill based on a container request dispatch (stuffing/destuffing).
   * This encapsulates the complex logic of finding applicable charges and calculating line items.
   */
  generateBillForRequest(request: ContainerRequest, billIdentifier: string): Promise<void>;
}
