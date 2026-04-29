import { IContainerRepository } from "../repositories/IContainerRepository";
import { IBillRepository } from "../repositories/IBillRepository";
import { IActivityRepository } from "../repositories/IActivityRepository";
import { IChargeRepository } from "../repositories/IChargeRepository";
import { ContainerRequest } from "../entities/ContainerRequest";
import { BillLineItem } from "../entities/Bill";
import { BillingMapper } from "../../application/mappers/BillingMapper";
import { IBillingDomainService } from "./IBillingDomainService";

export class BillingDomainService implements IBillingDomainService {
  constructor(
    private containerRepository: IContainerRepository,
    private billRepository: IBillRepository,
    private activityRepository: IActivityRepository,
    private chargeRepository: IChargeRepository
  ) {}

  async generateBillForRequest(
    request: ContainerRequest,
    billIdentifier: string
  ): Promise<void> {
    // 1. Find Container
    const containerNumber = request.containerNumber;
    if (!containerNumber) return;

    const containers = await this.containerRepository.findAll({ containerNumber });
    const container = containers.length > 0 ? containers[0] : null;

    if (!container) return;

    // 2. Fetch Activities and calculate line items
    const lineItems: BillLineItem[] = [];
    let totalAmount = 0;

    // --- A. Yard Storage (STOR) ---
    const storActivity = await this.activityRepository.findByCode("STOR");
    if (storActivity && storActivity.id) {
      const storCharge = await this.findApplicableCharge(
        storActivity.id,
        container.size,
        container.type,
        request.cargoCategoryId
      );
      if (storCharge) {
        let days = 1;
        if (container.gateInTime) {
          const gateInDate = new Date(container.gateInTime);
          const now = new Date();
          const diffMs = now.getTime() - gateInDate.getTime();
          days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }

        const storAmount = days * storCharge.rate;
        lineItems.push({
          activityCode: storActivity.code,
          activityName: storActivity.name,
          quantity: days,
          unitPrice: storCharge.rate,
          amount: storAmount,
        });
        totalAmount += storAmount;
      }
    }

    // --- B. Stuffing/Destuffing (STUF/DEST) ---
    const primaryCode = request.type === "stuffing" ? "STUF" : "DEST";
    const altCode = request.type === "stuffing" ? "STUFFING" : "DESTUFFING";

    let opActivity = await this.activityRepository.findByCode(primaryCode);
    if (!opActivity) {
      opActivity = await this.activityRepository.findByCode(altCode);
    }

    if (opActivity && opActivity.id) {
      const opCharge = await this.findApplicableCharge(
        opActivity.id,
        container.size,
        container.type,
        request.cargoCategoryId
      );
      if (opCharge) {
        lineItems.push({
          activityCode: opActivity.code,
          activityName: opActivity.name,
          quantity: 1,
          unitPrice: opCharge.rate,
          amount: opCharge.rate,
        });
        totalAmount += opCharge.rate;
      }
    }

    // --- C. Cargo Specific Charge ---
    if (request.cargoCharge && request.cargoCharge > 0) {
      lineItems.push({
        activityCode: "CARGO",
        activityName: `Cargo Charge (${request.cargoCategoryName || "Specialized"})`,
        quantity: 1,
        unitPrice: request.cargoCharge,
        amount: request.cargoCharge,
      });
      totalAmount += request.cargoCharge;
    }

    // --- D. Container Lift (LIFT) ---
    const liftActivity = await this.activityRepository.findByCode("LIFT");
    if (liftActivity && liftActivity.id) {
      const liftCharge = await this.findApplicableCharge(
        liftActivity.id,
        container.size,
        container.type,
        request.cargoCategoryId
      );
      if (liftCharge) {
        lineItems.push({
          activityCode: liftActivity.code,
          activityName: liftActivity.name,
          quantity: 1,
          unitPrice: liftCharge.rate,
          amount: liftCharge.rate,
        });
        totalAmount += liftCharge.rate;
      }
    }

    // 3. Persist Bill
    if (lineItems.length > 0 && container.id) {
      const containerBills = await this.billRepository.findByContainerId(container.id);
      const pendingBill = containerBills.find((b) => b.status === "pending");

      if (pendingBill) {
        if (pendingBill.remarks?.includes(billIdentifier)) {
          console.log(`[BillingDomainService] Bill for identifier ${billIdentifier} already exists. Skipping duplicate charge addition.`);
          return;
        }
        const updatedBill = BillingMapper.appendLineItems(pendingBill, lineItems, billIdentifier, request.type);
        await this.billRepository.save(updatedBill);
      } else {
        const bill = BillingMapper.createForRequest(
          request.type === "stuffing" ? "STUF" : "DEST",
          containerNumber,
          container.shippingLine,
          container.id,
          request.customerId,
          lineItems,
          totalAmount,
          request.type,
          billIdentifier
        );
        await this.billRepository.save(bill);
      }
    }
  }

  private async findApplicableCharge(
    activityId: string,
    size: string,
    type: string,
    cargoCategoryId?: string
  ) {
    if (cargoCategoryId) {
      let charge = await this.chargeRepository.findByCriteria(activityId, size, type, cargoCategoryId);
      if (charge) return charge;

      charge = await this.chargeRepository.findByCriteria(activityId, size, "all", cargoCategoryId);
      if (charge) return charge;

      charge = await this.chargeRepository.findByCriteria(activityId, "all", "all", cargoCategoryId);
      if (charge) return charge;
    }

    let charge = await this.chargeRepository.findByCriteria(activityId, size, type);
    if (!charge) charge = await this.chargeRepository.findByCriteria(activityId, size, "all");
    if (!charge) charge = await this.chargeRepository.findByCriteria(activityId, "all", "all");
    return charge;
  }
}
