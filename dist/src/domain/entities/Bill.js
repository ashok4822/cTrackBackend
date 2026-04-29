"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
class Bill {
    id;
    billNumber;
    containerNumber;
    shippingLine;
    containerId;
    customer;
    customerName;
    lineItems;
    totalAmount;
    status;
    dueDate;
    remarks;
    paidAt;
    paymentMethod;
    createdAt;
    updatedAt;
    constructor(id, billNumber, containerNumber, shippingLine, containerId, customer = null, customerName, lineItems = [], totalAmount = 0, status = "pending", dueDate = new Date(), remarks, paidAt, paymentMethod, createdAt, updatedAt) {
        this.id = id;
        this.billNumber = billNumber;
        this.containerNumber = containerNumber;
        this.shippingLine = shippingLine;
        this.containerId = containerId;
        this.customer = customer;
        this.customerName = customerName;
        this.lineItems = lineItems;
        this.totalAmount = totalAmount;
        this.status = status;
        this.dueDate = dueDate;
        this.remarks = remarks;
        this.paidAt = paidAt;
        this.paymentMethod = paymentMethod;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    update(data) {
        return new Bill(this.id, data.billNumber !== undefined ? data.billNumber : this.billNumber, data.containerNumber !== undefined ? data.containerNumber : this.containerNumber, data.shippingLine !== undefined ? data.shippingLine : this.shippingLine, data.containerId !== undefined ? data.containerId : this.containerId, data.customer !== undefined ? data.customer : this.customer, this.customerName, // Preserve original name or let repo re-populate
        data.lineItems !== undefined ? data.lineItems : this.lineItems, data.totalAmount !== undefined ? data.totalAmount : this.totalAmount, data.status !== undefined ? data.status : this.status, data.dueDate !== undefined ? data.dueDate : this.dueDate, data.remarks !== undefined ? data.remarks : this.remarks, data.paidAt !== undefined ? data.paidAt : this.paidAt, data.paymentMethod !== undefined ? data.paymentMethod : this.paymentMethod, this.createdAt, new Date());
    }
}
exports.Bill = Bill;
//# sourceMappingURL=Bill.js.map