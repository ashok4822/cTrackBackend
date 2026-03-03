import { UpdateContainer } from "./src/application/useCases/UpdateContainer";
import { UpdateContainerRequest } from "./src/application/useCases/UpdateContainerRequest";
import { Container } from "./src/domain/entities/Container";

// Minimal jest-like mock for quick environment simulation
class Mock {
    calls: any[][] = [];
    resolvedValue: any;
    impl: Function | null = null;

    async(...args: any[]) => {
    this.calls.push(args);
    if (this.impl) return await this.impl(...args);
    return this.resolvedValue;
}

mockResolvedValue(val: any) {
    this.resolvedValue = val;
    return this;
}

mockImplementation(impl: Function) {
    this.impl = impl;
    return this;
}

mockClear() {
    this.calls = [];
    return this;
}
}

const createMock = () => {
    const m = new Mock();
    const fn: any = (...args: any[]) => m.async(...args);
    fn.mockResolvedValue = (v: any) => m.mockResolvedValue(v);
    fn.mockImplementation = (i: Function) => m.mockImplementation(i);
    fn.mockClear = () => m.mockClear();
    fn.getCalls = () => m.calls;
    return fn;
};

// Mock Repositories
const mockContainerRepo: any = {
    findById: createMock(),
    save: createMock(),
    findAll: createMock()
};
const mockHistoryRepo: any = { save: createMock() };
const mockEquipmentRepo: any = { findAll: createMock() };
const mockEquipHistoryRepo: any = { save: createMock() };
const mockBillRepo: any = { findByContainerId: createMock(), save: createMock(), findAll: createMock() };
const mockReqRepo: any = { findById: createMock(), update: createMock() };
const mockActivityRepo: any = { findByCode: createMock() };
const mockChargeRepo: any = { findByCriteria: createMock() };

async function verify() {
    console.log("--- Starting Verification ---");

    const updateContainer = new UpdateContainer(
        mockContainerRepo,
        mockHistoryRepo,
        mockEquipmentRepo,
        mockEquipHistoryRepo,
        mockBillRepo
    );

    const updateReq = new UpdateContainerRequest(
        mockReqRepo,
        mockContainerRepo,
        mockBillRepo,
        mockActivityRepo,
        mockChargeRepo
    );

    // 1. Verify UpdateContainer NO LONGER generates LIFT bill
    console.log("Testing UpdateContainer (Yard Allocation)...");
    const testContainer = new Container("1", "CONT123", "20ft", "Standard", "gate-in", "SL1", true, "import", null, null, new Date(), null, 0, 0, 0, "", "", "", false, "", false, new Date(), new Date());
    mockContainerRepo.findById.mockResolvedValue(testContainer);

    await updateContainer.execute("1", { yardLocation: { block: "A1" } as any });

    const liftBill = mockBillRepo.save.getCalls().find((call: any) => call[0].lineItems.some((li: any) => li.activityCode === "LIFT"));
    if (liftBill) {
        console.error("FAILED: LIFT bill generated during yard allocation!");
    } else {
        console.log("PASSED: No LIFT bill generated during yard allocation.");
    }

    // 2. Verify UpdateContainerRequest DOES generate LIFT bill
    console.log("\nTesting UpdateContainerRequest (Dispatch)...");
    mockBillRepo.save.mockClear();
    mockBillRepo.findAll.mockResolvedValue([]);
    mockContainerRepo.findAll.mockResolvedValue([testContainer]);
    mockActivityRepo.findByCode.mockImplementation((code: string) => ({ id: code, code, name: code }));
    mockChargeRepo.findByCriteria.mockResolvedValue({ rate: 100 });
    mockReqRepo.findById.mockResolvedValue({ id: "REQ1", status: "pending", type: "stuffing", containerNumber: "CONT123" });
    mockReqRepo.update.mockResolvedValue({ id: "REQ1", status: "ready-for-dispatch", type: "stuffing", containerNumber: "CONT123", customerId: "CUST1" });

    await updateReq.execute("REQ1", { status: "ready-for-dispatch" });

    const dispatchedBill = mockBillRepo.save.getCalls().find((call: any) => call[0].lineItems.some((li: any) => li.activityCode === "LIFT"));
    if (dispatchedBill) {
        console.log("PASSED: LIFT bill generated during dispatch.");
        console.log("Line Items:", JSON.stringify(dispatchedBill[0].lineItems, null, 2));
    } else {
        console.error("FAILED: LIFT bill NOT generated during dispatch!");
    }

    console.log("\n--- Verification Finished ---");
}

verify().catch(console.error);
