import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { Container } from "../../domain/entities/Container";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { Bill, BillLineItem } from "../../domain/entities/Bill";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";
import { INotificationService } from "../services/INotificationService";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";

interface UpdateContainerData extends Partial<ContainerRequest> {
  equipmentId?: string;
}

export class UpdateContainerRequest {
  constructor(
    private repository: IContainerRequestRepository,
    private containerRepository?: IContainerRepository,
    private billRepository?: IBillRepository,
    private activityRepository?: IActivityRepository,
    private chargeRepository?: IChargeRepository,
    private equipmentHistoryRepository?: IEquipmentHistoryRepository,
    private auditLogRepository?: IAuditLogRepository,
    private notificationService?: INotificationService,
  ) {}

  async execute(
    id: string,
    data: UpdateContainerData,
    userContext?: {
      userId: string;
      userName: string;
      userRole: string;
      ipAddress: string;
    },
  ): Promise<ContainerRequest | null> {
    const existingRequest = await this.repository.findById(id);
    if (!existingRequest) return null;

    // Automatically log checkpoints for status changes and container allotment
    const currentCheckpoints = data.checkpoints
      ? [...data.checkpoints]
      : [...(existingRequest.checkpoints || [])];
    let changed = false;

    if (data.status && data.status !== existingRequest.status) {
      // Check if status change is already recorded in the provided checkpoints (within last 10s)
      const alreadyLogged = currentCheckpoints.some(
        (cp) =>
          cp.status === data.status &&
          Math.abs(new Date(cp.timestamp).getTime() - new Date().getTime()) <
            10000,
      );

      if (!alreadyLogged) {
        currentCheckpoints.push({
          location: "Terminal Office",
          timestamp: new Date(),
          status: data.status,
          remarks: `Request status updated to ${data.status.replace(/-/g, " ")}`,
        });
        changed = true;
      }
    }

    if (
      data.containerNumber &&
      data.containerNumber !== existingRequest.containerNumber
    ) {
      // Check if container allotment is already recorded
      const alreadyLogged = currentCheckpoints.some(
        (cp) =>
          cp.remarks?.includes(data.containerNumber!) &&
          Math.abs(new Date(cp.timestamp).getTime() - new Date().getTime()) <
            10000,
      );

      if (!alreadyLogged) {
        currentCheckpoints.push({
          location: "Yard Allocation",
          timestamp: new Date(),
          status: data.status || existingRequest.status,
          remarks: `Container ${data.containerNumber} allotted to request`,
        });
        changed = true;
      }
    }

    if (changed || data.checkpoints) {
      Object.assign(data, { checkpoints: currentCheckpoints });
    }

    const updatedRequest = await this.repository.update(id, data);

    // Audit Log
    if (this.auditLogRepository && userContext && updatedRequest) {
      await this.auditLogRepository.save(
        new AuditLog(
          null,
          userContext.userId,
          userContext.userRole,
          userContext.userName,
          "REQUEST_UPDATED",
          "Request",
          updatedRequest.id,
          JSON.stringify({
            status: updatedRequest.status,
            containerNumber: updatedRequest.containerNumber,
          }),
          userContext.ipAddress,
        ),
      );
    }

    // Notify customer about request update
    if (
      updatedRequest &&
      data.status &&
      data.status !== existingRequest.status &&
      this.notificationService
    ) {
      await this.notificationService.send(updatedRequest.customerId, {
        type: data.status === "rejected" ? "alert" : "success",
        title: "Request Status Updated",
        message: `Your ${updatedRequest.type} request status has been updated to ${data.status}.`,
        link: "/customer/requests",
      });
    }

    // If a request is approved and a container is allocated, assign container ownership and transfer bills to customer
    if (
      updatedRequest &&
      existingRequest &&
      existingRequest.status !== "approved" &&
      data.status === "approved" &&
      (data.containerId || updatedRequest.containerId) &&
      this.containerRepository
    ) {
      try {
        const containerId = data.containerId || updatedRequest.containerId;
        const container = await this.containerRepository.findById(containerId!);
        if (container && container.customer !== existingRequest.customerId) {
          // 1. Assign container to customer
          // Create a new Container instance with updated customer and customerName
          const newContainer = new Container(
            container.id,
            container.containerNumber,
            container.size,
            container.type,
            container.status,
            container.shippingLine,
            container.empty,
            container.movementType,
            existingRequest.customerId, // New Customer (ID)
            undefined, // customerName will be populated by repository mapWithCustomers
            container.yardLocation,
            container.gateInTime,
            container.gateOutTime,
            container.dwellTime,
            container.weight,
            container.cargoWeight,
            container.cargoDescription,
            container.hazardousClassification,
            container.sealNumber,
            container.damaged,
            container.damageDetails,
            container.blacklisted,
            container.cargoCategory,
            container.createdAt,
            container.updatedAt,
          );

          await this.containerRepository.save(newContainer);

          // 2. Transfer pending bills to customer
          if (this.billRepository) {
            const bills = await this.billRepository.findByContainerId(
              containerId!,
            );
            const pendingBills = bills.filter((b) => b.status === "pending");
            for (const bill of pendingBills) {
              const updatedBill = new Bill(
                bill.id,
                bill.billNumber,
                bill.containerNumber,
                bill.shippingLine,
                bill.containerId,
                existingRequest.customerId, // New Customer
                bill.customerName,
                bill.lineItems,
                bill.totalAmount,
                bill.status,
                bill.dueDate,
                bill.remarks,
                bill.paidAt,
                bill.paymentMethod,
                bill.createdAt,
                new Date(), // updatedAt
              );
              await this.billRepository.save(updatedBill);
            }
          }
        }
      } catch (error) {
        console.error(
          "Failed to assign container to customer on request approval:",
          error,
        );
      }
    }

    // If the request was just approved for dispatch (status updated to "approved" or "in-transit" or "ready-for-dispatch" for the first time)
    // Note: The frontend might send "approved" as the status when dispatching from the Stuffing/Destuffing pages.
    // Generate a bill here if one hasn't been generated yet for this specific request.
    if (
      updatedRequest &&
      existingRequest &&
      existingRequest.status !== data.status &&
      (data.status === "approved" ||
        data.status === "in-transit" ||
        data.status === "ready-for-dispatch") &&
      this.containerRepository &&
      this.billRepository &&
      this.activityRepository &&
      this.chargeRepository
    ) {
      try {
        // Record equipment history if equipmentId is provided
        if (data.equipmentId && this.equipmentHistoryRepository) {
          const equipmentHistory = new EquipmentHistory(
            null,
            data.equipmentId,
            `${updatedRequest.type === "stuffing" ? "Stuffing" : "Destuffing"} dispatch`,
            `Container: ${updatedRequest.containerNumber || "N/A"}`,
            "Operator", // In a real app, this would be the logged-in user's name
            new Date(),
          );
          await this.equipmentHistoryRepository.save(equipmentHistory);
        }

        // Ensure don't generate duplicate bills for the same request
        // A robust way would be to check existing bills, but use a prefix in remarks for now.
        const billIdentifier = `REQ-${updatedRequest.id}`;
        const existingBills = await this.billRepository.findAll();
        const alreadyBilled = existingBills.some((b) =>
          b.remarks?.includes(billIdentifier),
        );

        if (!alreadyBilled) {
          await this.generateHandlingAndStorageBill(
            updatedRequest,
            billIdentifier,
          );
        }
      } catch (error) {
        console.error(
          "Failed to process dispatch (history/billing) for Container Request:",
          error,
        );
        // Non-fatal error
      }
    }

    return updatedRequest;
  }

  private async generateHandlingAndStorageBill(
    request: ContainerRequest,
    billIdentifier: string,
  ): Promise<void> {
    if (
      !this.containerRepository ||
      !this.billRepository ||
      !this.activityRepository ||
      !this.chargeRepository
    )
      return;

    // 1. Find Container
    const containerNumber = request.containerNumber;
    if (!containerNumber) {
      console.warn(
        `Cannot generate bill for request ${request.id}: No container number found.`,
      );
      return;
    }

    const containers = await this.containerRepository.findAll({
      containerNumber,
    });
    const container = containers.length > 0 ? containers[0] : null;

    if (!container) {
      console.warn(
        `Cannot generate bill for request ${request.id}: Container ${containerNumber} not found in repository.`,
      );
      return;
    }

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
        request.cargoCategoryId,
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
        request.cargoCategoryId,
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
      } else {
        console.warn(
          `Charge rate not found for activity: ${opActivity.code}, container: ${container.size}/${container.type}, category: ${request.cargoCategoryId}`,
        );
      }
    }

    // --- C. Cargo Specific Charge (if any) ---
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
        request.cargoCategoryId,
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

    // 3. Update Existing Pending Bill OR Create New Bill
    if (lineItems.length > 0 && container.id) {
      // Check for existing pending bill for this container
      const containerBills = await this.billRepository.findByContainerId(
        container.id,
      );
      const pendingBill = containerBills.find((b) => b.status === "pending");

      if (pendingBill) {
        // Append line items to existing pending bill
        const updatedLineItems = [...pendingBill.lineItems];
        let additionalAmount = 0;

        for (const item of lineItems) {
          // Check if this activity is already billed in the pending bill
          // (Optional: depending on business logic, we might want to group or separate)
          updatedLineItems.push(item);
          additionalAmount += item.amount;
        }

        const updatedBill = new Bill(
          pendingBill.id,
          pendingBill.billNumber,
          pendingBill.containerNumber,
          pendingBill.shippingLine,
          pendingBill.containerId,
          pendingBill.customer,
          pendingBill.customerName,
          updatedLineItems,
          pendingBill.totalAmount + additionalAmount,
          pendingBill.status,
          pendingBill.dueDate,
          `${pendingBill.remarks || ""} | Added ${request.type} charges. ${billIdentifier}`.trim(),
          pendingBill.paidAt,
          pendingBill.paymentMethod,
          pendingBill.createdAt,
          new Date(), // updatedAt
        );

        await this.billRepository.save(updatedBill);
      } else {
        // Create new bill
        const billNumber = `BL-${primaryCode}-${Date.now().toString().slice(-6)}`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // 30 days due

        const bill = new Bill(
          null,
          billNumber,
          containerNumber,
          container.shippingLine,
          container.id,
          request.customerId,
          undefined,
          lineItems,
          totalAmount,
          "pending",
          dueDate,
          `Auto-generated for ${request.type} request dispatch. ${billIdentifier}`,
          undefined, // paidAt
          undefined, // paymentMethod
          new Date(), // createdAt
        );

        const savedBill = await this.billRepository.save(bill);

        // Notify customer about new bill
      }
    } else {
    }
  }

  private async findApplicableCharge(
    activityId: string,
    size: string,
    type: string,
    cargoCategoryId?: string,
  ) {
    if (!this.chargeRepository) return null;

    // Try with Cargo Category first
    if (cargoCategoryId) {
      let charge = await this.chargeRepository.findByCriteria(
        activityId,
        size,
        type,
        cargoCategoryId,
      );
      if (charge) return charge;

      charge = await this.chargeRepository.findByCriteria(
        activityId,
        size,
        "all",
        cargoCategoryId,
      );
      if (charge) return charge;

      charge = await this.chargeRepository.findByCriteria(
        activityId,
        "all",
        "all",
        cargoCategoryId,
      );
      if (charge) return charge;
    }

    // Fallback to generic charges if no category specific charge found or provided
    let charge = await this.chargeRepository.findByCriteria(
      activityId,
      size,
      type,
    );
    if (!charge) {
      charge = await this.chargeRepository.findByCriteria(
        activityId,
        size,
        "all",
      );
    }
    if (!charge) {
      charge = await this.chargeRepository.findByCriteria(
        activityId,
        "all",
        "all",
      );
    }
    return charge;
  }
}
