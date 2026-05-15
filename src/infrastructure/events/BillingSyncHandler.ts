import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { ContainerUpdatedPayload } from "../../types/eventPayloads";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { Bill } from "../../domain/entities/Bill";

export class BillingSyncHandler {
    constructor(
        private billRepository: IBillRepository,
        private eventBus: IEventBus
    ) {
        this.initialize();
    }

    private initialize() {
        // Transfer pending bills when a container's customer changes
        this.eventBus.on(DomainEvents.CONTAINER_UPDATED, async (data: ContainerUpdatedPayload) => {
            try {
                const { oldContainer, newContainer } = data;
                
                // If customer changed, transfer pending bills to the new customer
                if (newContainer.customer !== oldContainer.customer) {
                    const bills = await this.billRepository.findByContainerId(newContainer.id!);
                    const pendingBills = bills.filter(b => b.status === "pending");
                    
                    for (const bill of pendingBills) {
                        const updatedBill = new Bill(
                            bill.id,
                            bill.billNumber,
                            bill.containerNumber,
                            bill.shippingLine,
                            bill.containerId,
                            newContainer.customer || null,
                            bill.customerName, // This might need updating too if customerName changed
                            bill.lineItems,
                            bill.totalAmount,
                            bill.status,
                            bill.dueDate,
                            bill.remarks,
                            bill.paidAt,
                            bill.paymentMethod,
                            bill.createdAt,
                            new Date() // updatedAt
                        );
                        await this.billRepository.save(updatedBill);
                    }
                    console.log(`[BillingSyncHandler] Transferred ${pendingBills.length} pending bills for container ${newContainer.containerNumber}`);
                }
            } catch (error) {
                console.error("[BillingSyncHandler] Failed to sync bills for Container Update:", error);
            }
        });
    }
}
