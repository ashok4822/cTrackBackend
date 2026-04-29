"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingSyncHandler = void 0;
const IEventBus_1 = require("../../domain/events/IEventBus");
const EventEmitterBus_1 = require("./EventEmitterBus");
const Bill_1 = require("../../domain/entities/Bill");
class BillingSyncHandler {
    billRepository;
    constructor(billRepository) {
        this.billRepository = billRepository;
        this.initialize();
    }
    initialize() {
        // Transfer pending bills when a container's customer changes
        EventEmitterBus_1.eventBus.on(IEventBus_1.DomainEvents.CONTAINER_UPDATED, async (data) => {
            try {
                const { oldContainer, newContainer } = data;
                // If customer changed, transfer pending bills to the new customer
                if (newContainer.customer !== oldContainer.customer) {
                    const bills = await this.billRepository.findByContainerId(newContainer.id);
                    const pendingBills = bills.filter(b => b.status === "pending");
                    for (const bill of pendingBills) {
                        const updatedBill = new Bill_1.Bill(bill.id, bill.billNumber, bill.containerNumber, bill.shippingLine, bill.containerId, newContainer.customer || null, bill.customerName, // This might need updating too if customerName changed
                        bill.lineItems, bill.totalAmount, bill.status, bill.dueDate, bill.remarks, bill.paidAt, bill.paymentMethod, bill.createdAt, new Date() // updatedAt
                        );
                        await this.billRepository.save(updatedBill);
                    }
                    console.log(`[BillingSyncHandler] Transferred ${pendingBills.length} pending bills for container ${newContainer.containerNumber}`);
                }
            }
            catch (error) {
                console.error("[BillingSyncHandler] Failed to sync bills for Container Update:", error);
            }
        });
    }
}
exports.BillingSyncHandler = BillingSyncHandler;
//# sourceMappingURL=BillingSyncHandler.js.map