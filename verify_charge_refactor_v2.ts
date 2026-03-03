import { UpdateContainer } from "./src/application/useCases/UpdateContainer";
import { UpdateContainerRequest } from "./src/application/useCases/UpdateContainerRequest";

// Basic mock helper
const createMock = () => {
    const calls: any[][] = [];
    const fn: any = async (...args: any[]) => {
        calls.push(args);
        if (fn._impl) return await fn._impl(...args);
        return fn._res;
    };
    fn.calls = calls;
    fn.mockResolvedValue = (v: any) => { fn._res = v; return fn; };
    fn.mockImplementation = (i: any) => { fn._impl = i; return fn; };
    fn.mockClear = () => { calls.length = 0; return fn; };
    return fn;
};

// Mock Repositories
const mockContainerRepo: any = { findById: createMock(), save: createMock(), findAll: createMock() };
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

    const testContainer = {
        id: "1",
        containerNumber: "CONT123",
        size: "20ft",
        type: "Standard",
        status: "gate-in",
        yardLocation: null,
        shippingLine: "SL1",
        customer: "CUST1",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // 1. Verify UpdateContainer NO LONGER generates LIFT bill
    console.log("Testing UpdateContainer (Yard Allocation)...");
    mockContainerRepo.findById.mockResolvedValue(testContainer);

    await updateContainer.execute("1", { yardLocation: { block: "A1" } as any });

    const liftBill = mockBillRepo.save.calls.find((call: any) => call[0].lineItems && call[0].lineItems.some((li: any) => li.activityCode === "LIFT"));
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

    const dispatchedBill = mockBillRepo.save.calls.find((call: any) => call[0].lineItems && call[0].lineItems.some((li: any) => li.activityCode === "LIFT"));
    if (dispatchedBill) {
        console.log("PASSED: LIFT bill generated during dispatch.");
        console.log("Line Items:", JSON.stringify(dispatchedBill[0].lineItems, null, 2));
    } else {
        console.error("FAILED: LIFT bill NOT generated during dispatch!");
    }

    console.log("\n--- Verification Finished ---");
}

verify().catch(console.error);
