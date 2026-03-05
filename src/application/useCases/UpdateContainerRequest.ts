import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IEquipmentHistoryRepository } from "../../domain/repositories/IEquipmentHistoryRepository";
import { Bill, BillLineItem } from "../../domain/entities/Bill";
import { EquipmentHistory } from "../../domain/entities/EquipmentHistory";

export class UpdateContainerRequest {
    constructor(
        private repository: IContainerRequestRepository,
        private containerRepository?: IContainerRepository,
        private billRepository?: IBillRepository,
        private activityRepository?: IActivityRepository,
        private chargeRepository?: IChargeRepository,
        private equipmentHistoryRepository?: IEquipmentHistoryRepository
    ) { }

    async execute(id: string, data: Partial<ContainerRequest>): Promise<ContainerRequest | null> {
        const existingRequest = await this.repository.findById(id);
        const updatedRequest = await this.repository.update(id, data);

        // If a stuffing request is approved and a container is allocated, assign container ownership and transfer bills to customer
        if (
            updatedRequest &&
            existingRequest &&
            existingRequest.status !== "approved" &&
            data.status === "approved" &&
            data.containerId &&
            existingRequest.type === "stuffing" &&
            this.containerRepository
        ) {
            try {
                const container = await this.containerRepository.findById(data.containerId);
                if (container && container.customer !== existingRequest.customerId) {
                    // 1. Assign container to customer
                    const updatedContainer = Object.assign(Object.create(Object.getPrototypeOf(container)), container, {
                        ...container,
                        customer: existingRequest.customerId
                    });

                    // Must update the createdAt/updatedAt appropriately or just use the whole class if possible 
                    // To do this cleanly, create a new Container instance
                    const newContainer = new (container.constructor as any)(
                        container.id,
                        container.containerNumber,
                        container.size,
                        container.type,
                        container.status,
                        container.shippingLine,
                        container.empty,
                        container.movementType,
                        existingRequest.customerId, // New Customer
                        container.yardLocation,
                        container.gateInTime,
                        container.gateOutTime,
                        container.dwellTime,
                        container.weight,
                        container.cargoWeight,
                        (container as any).cargoDescription,
                        (container as any).hazardousClassification,
                        container.sealNumber,
                        container.damaged,
                        container.damageDetails,
                        container.blacklisted,
                        container.createdAt,
                        container.updatedAt
                    );

                    await this.containerRepository.save(newContainer);

                    // 2. Transfer pending bills to customer
                    if (this.billRepository) {
                        const bills = await this.billRepository.findByContainerId(data.containerId);
                        const pendingBills = bills.filter(b => b.status === "pending");
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
                                bill.createdAt,
                                bill.updatedAt
                            );
                            await this.billRepository.save(updatedBill);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to assign container to customer on stuffing request approval:", error);
            }
        }

        // If the request was just approved for dispatch (status updated to "approved" or "in-transit" or "ready-for-dispatch" for the first time)
        // Note: The frontend might send "approved" as the status when dispatching from the Stuffing/Destuffing pages.
        // Generate a bill here if one hasn't been generated yet for this specific request.
        if (
            updatedRequest &&
            existingRequest &&
            existingRequest.status !== data.status &&
            (data.status === "approved" || data.status === "in-transit" || data.status === "ready-for-dispatch") &&
            this.containerRepository &&
            this.billRepository &&
            this.activityRepository &&
            this.chargeRepository
        ) {
            try {
                // Record equipment history if equipmentId is provided
                if ((data as any).equipmentId && this.equipmentHistoryRepository) {
                    const equipmentHistory = new EquipmentHistory(
                        null,
                        (data as any).equipmentId,
                        `${updatedRequest.type === "stuffing" ? "Stuffing" : "Destuffing"} dispatch`,
                        `Container: ${updatedRequest.containerNumber || "N/A"}`,
                        "Operator", // In a real app, this would be the logged-in user's name
                        new Date()
                    );
                    await this.equipmentHistoryRepository.save(equipmentHistory);
                }

                // Ensure don't generate duplicate bills for the same request
                // A robust way would be to check existing bills, but use a prefix in remarks for now.
                const billIdentifier = `REQ-${updatedRequest.id}`;
                const existingBills = await this.billRepository.findAll();
                const alreadyBilled = existingBills.some(b => b.remarks?.includes(billIdentifier));

                if (!alreadyBilled) {
                    await this.generateHandlingAndStorageBill(updatedRequest, billIdentifier);
                }
            } catch (error) {
                console.error("Failed to process dispatch (history/billing) for Container Request:", error);
                // Non-fatal error
            }
        }

        return updatedRequest;
    }

    private async generateHandlingAndStorageBill(request: ContainerRequest, billIdentifier: string): Promise<void> {
        if (!this.containerRepository || !this.billRepository || !this.activityRepository || !this.chargeRepository) return;

        // 1. Find Container
        const containerNumber = request.containerNumber;
        if (!containerNumber) {
            console.warn(`Cannot generate bill for request ${request.id}: No container number found.`);
            return;
        }

        const containers = await this.containerRepository.findAll({ containerNumber });
        const container = containers.length > 0 ? containers[0] : null;

        if (!container) {
            console.warn(`Cannot generate bill for request ${request.id}: Container ${containerNumber} not found in repository.`);
            return;
        }

        // 2. Fetch Activities and calculate line items
        const lineItems: BillLineItem[] = [];
        let totalAmount = 0;

        // --- A. Yard Storage (STOR) ---
        // Yard storage is usually billed on gate-out, but if requested we can add partial storage here.
        // For stuffing/destuffing requests, we typically bill the specific operation + any storage accrued.
        const storActivity = await this.activityRepository.findByCode("STOR");
        if (storActivity && storActivity.id) {
            const storCharge = await this.findApplicableCharge(storActivity.id, container.size, container.type);
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
                    amount: storAmount
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
            const opCharge = await this.findApplicableCharge(opActivity.id, container.size, container.type);
            if (opCharge) {
                lineItems.push({
                    activityCode: opActivity.code,
                    activityName: opActivity.name,
                    quantity: 1,
                    unitPrice: opCharge.rate,
                    amount: opCharge.rate
                });
                totalAmount += opCharge.rate;
            } else {
                console.warn(`Charge rate not found for activity: ${opActivity.code}, container: ${container.size}/${container.type}`);
            }
        } else {
            console.warn(`Activity not found for codes: ${primaryCode}, ${altCode}`);
        }

        // --- C. Container Lift (LIFT) ---
        // Handling charge is now calculated here instead of yard allocation
        const liftActivity = await this.activityRepository.findByCode("LIFT");
        if (liftActivity && liftActivity.id) {
            const liftCharge = await this.findApplicableCharge(liftActivity.id, container.size, container.type);
            if (liftCharge) {
                lineItems.push({
                    activityCode: liftActivity.code,
                    activityName: liftActivity.name,
                    quantity: 1,
                    unitPrice: liftCharge.rate,
                    amount: liftCharge.rate
                });
                totalAmount += liftCharge.rate;
            } else {
                console.warn(`Charge rate not found for activity: LIFT, container: ${container.size}/${container.type}`);
            }
        }

        // 3. Update Existing Pending Bill OR Create New Bill
        if (lineItems.length > 0 && container.id) {
            // Check for existing pending bill for this container
            const containerBills = await this.billRepository.findByContainerId(container.id);
            const pendingBill = containerBills.find(b => b.status === "pending");

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
                    pendingBill.createdAt,
                    new Date()
                );

                await this.billRepository.save(updatedBill);
                console.log(`Updated existing pending bill: ${pendingBill.billNumber} with ${request.type} charges.`);
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
                    new Date()
                );

                const savedBill = await this.billRepository.save(bill);
                console.log(`Bill generated successfully: ${savedBill.billNumber} for customer: ${request.customerId} (Request: ${request.id})`);
            }
        } else {
            console.log(`Skipped bill generation for request ${request.id}: No billable line items calculated.`);
        }
    }

    private async findApplicableCharge(activityId: string, size: string, type: string) {
        if (!this.chargeRepository) return null;

        let charge = await this.chargeRepository.findByCriteria(activityId, size, type);
        if (!charge) {
            charge = await this.chargeRepository.findByCriteria(activityId, size, "all");
        }
        if (!charge) {
            charge = await this.chargeRepository.findByCriteria(activityId, "all", "all");
        }
        return charge;
    }
}
