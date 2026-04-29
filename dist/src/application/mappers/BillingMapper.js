"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingMapper = void 0;
const Bill_1 = require("../../domain/entities/Bill");
const BillTransaction_1 = require("../../domain/entities/BillTransaction");
class BillingMapper {
    static toEntity(dto) {
        const billNumber = `BL-MISC-${Date.now().toString().slice(-6)}`;
        return new Bill_1.Bill(null, billNumber, dto.containerNumber, dto.shippingLine || "N/A", dto.containerId, dto.customer || null, dto.customerName, dto.lineItems.map(item => ({
            ...item,
            amount: item.quantity * item.unitPrice
        })), dto.totalAmount, "pending", dto.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), dto.remarks, undefined, // paidAt
        undefined, // paymentMethod
        new Date(), new Date());
    }
    /** Create a new BillTransaction entity for payment recording */
    static toTransactionEntity(billId, userId, amount, method, status, transactionId, orderId) {
        return new BillTransaction_1.BillTransaction(null, billId, userId, amount, method, status, transactionId, orderId);
    }
    /** Append additional line items to an existing pending Bill (for UpdateContainerRequest billing) */
    static appendLineItems(existing, additionalLineItems, billIdentifier, requestType) {
        const updatedLineItems = [...existing.lineItems, ...additionalLineItems];
        const additionalAmount = additionalLineItems.reduce((sum, i) => sum + i.amount, 0);
        return new Bill_1.Bill(existing.id, existing.billNumber, existing.containerNumber, existing.shippingLine, existing.containerId, existing.customer, existing.customerName, updatedLineItems, existing.totalAmount + additionalAmount, existing.status, existing.dueDate, `${existing.remarks || ""} | Added ${requestType} charges. ${billIdentifier}`.trim(), existing.paidAt, existing.paymentMethod, existing.createdAt, new Date());
    }
    /** Create a new auto-generated Bill for a container request dispatch */
    static createForRequest(billNumberPrefix, containerNumber, shippingLine, containerId, customerId, lineItems, totalAmount, requestType, billIdentifier) {
        const billNumber = `BL-${billNumberPrefix}-${Date.now().toString().slice(-6)}`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        return new Bill_1.Bill(null, billNumber, containerNumber, shippingLine, containerId, customerId, undefined, lineItems, totalAmount, "pending", dueDate, `Auto-generated for ${requestType} request dispatch. ${billIdentifier}`, undefined, undefined, new Date());
    }
    static toResponseDto(bill) {
        return {
            id: bill.id,
            billNumber: bill.billNumber,
            containerNumber: bill.containerNumber,
            shippingLine: bill.shippingLine,
            containerId: bill.containerId,
            customer: bill.customer,
            customerName: bill.customerName,
            lineItems: bill.lineItems,
            totalAmount: bill.totalAmount,
            status: bill.status,
            dueDate: bill.dueDate,
            remarks: bill.remarks,
            paidAt: bill.paidAt,
            paymentMethod: bill.paymentMethod,
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
        };
    }
    static toCollectionResponseDto(bills) {
        return {
            items: bills.map(b => this.toResponseDto(b)),
            total: bills.length,
        };
    }
    static toTransactionResponseDto(tx) {
        return {
            id: tx.id,
            billId: tx.billId,
            userId: tx.userId,
            amount: tx.amount,
            method: tx.method,
            status: tx.status,
            transactionId: tx.transactionId || "",
            orderId: tx.orderId,
            errorDetails: tx.errorDetails,
            timestamp: tx.timestamp || tx.createdAt || new Date(),
        };
    }
    static toTransactionCollectionResponseDto(transactions) {
        return {
            items: transactions.map(tx => this.toTransactionResponseDto(tx)),
            total: transactions.length,
        };
    }
}
exports.BillingMapper = BillingMapper;
//# sourceMappingURL=BillingMapper.js.map