import { Bill, BillLineItem } from "../entities/Bill";

export class BillFactory {
  /** Create a new auto-generated Bill for a container request dispatch */
  static createForRequest(
    billNumberPrefix: string,
    containerNumber: string,
    shippingLine: string,
    containerId: string,
    customerId: string,
    lineItems: BillLineItem[],
    totalAmount: number,
    requestType: string,
    billIdentifier: string
  ): Bill {
    const billNumber = `BL-${billNumberPrefix}-${Date.now().toString().slice(-6)}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    return new Bill(
      null,
      billNumber,
      containerNumber,
      shippingLine,
      containerId,
      customerId,
      undefined,
      lineItems,
      totalAmount,
      "pending",
      dueDate,
      `Auto-generated for ${requestType} request dispatch. ${billIdentifier}`,
      undefined,
      undefined,
      new Date()
    );
  }

  /** Append additional line items to an existing pending Bill (for UpdateContainerRequest billing) */
  static appendLineItems(
    existing: Bill,
    additionalLineItems: BillLineItem[],
    billIdentifier: string,
    requestType: string
  ): Bill {
    const updatedLineItems = [...existing.lineItems, ...additionalLineItems];
    const additionalAmount = additionalLineItems.reduce((sum, i) => sum + i.amount, 0);
    return new Bill(
      existing.id,
      existing.billNumber,
      existing.containerNumber,
      existing.shippingLine,
      existing.containerId,
      existing.customer,
      existing.customerName,
      updatedLineItems,
      existing.totalAmount + additionalAmount,
      existing.status,
      existing.dueDate,
      `${existing.remarks || ""} | Added ${requestType} charges. ${billIdentifier}`.trim(),
      existing.paidAt,
      existing.paymentMethod,
      existing.createdAt,
      new Date()
    );
  }
}
