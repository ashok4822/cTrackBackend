const { UpdateContainer } = require("./dist/application/useCases/UpdateContainer");
const { UpdateContainerRequest } = require("./dist/application/useCases/UpdateContainerRequest");
const { Container } = require("./dist/domain/entities/Container");

// Minimal mock
class Mock {
    constructor() {
        this.calls = [];
        this.resolvedValue = undefined;
        this.impl = null;
    }

    async execute(...args) {
        this.calls.push(args);
        if (this.impl) return await this.impl(...args);
        return this.resolvedValue;
    }

    mockResolvedValue(val) {
        this.resolvedValue = val;
        return this;
    }

    mockImplementation(impl) {
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
    const fn = (...args) => m.execute(...args);
    fn.mockResolvedValue = (v) => m.mockResolvedValue(v);
    fn.mockImplementation = (i) => m.mockImplementation(i);
    fn.mockClear = () => m.mockClear();
    fn.getCalls = () => m.calls;
    return fn;
};

// Mock Repositories
const mockContainerRepo = {
    findById: createMock(),
    save: createMock(),
    findAll: createMock()
};
const mockHistoryRepo = { save: createMock() };
const mockEquipmentRepo = { findAll: createMock() };
const mockEquipHistoryRepo = { save: createMock() };
const mockBillRepo = { findByContainerId: createMock(), save: createMock(), findAll: createMock() };
const mockReqRepo = { findById: createMock(), update: createMock() };
const mockActivityRepo = { findByCode: createMock() };
const mockChargeRepo = { findByCriteria: createMock() };

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
        customer: "CUST1"
    };

    // 1. Verify UpdateContainer NO LONGER generates LIFT bill
    console.log("Testing UpdateContainer (Yard Allocation)...");
    mockContainerRepo.findById.mockResolvedValue(testContainer);

    await updateContainer.execute("1", { yardLocation: { block: "A1" } });

    const liftBill = mockBillRepo.save.getCalls().find(call => call[0].lineItems && call[0].lineItems.some(li => li.activityCode === "LIFT"));
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
    mockActivityRepo.findByCode.mockImplementation((code) => ({ id: code, code, name: code }));
    mockChargeRepo.findByCriteria.mockResolvedValue({ rate: 100 });
    mockReqRepo.findById.mockResolvedValue({ id: "REQ1", status: "pending", type: "stuffing", containerNumber: "CONT123" });
    mockReqRepo.update.mockResolvedValue({ id: "REQ1", status: "ready-for-dispatch", type: "stuffing", containerNumber: "CONT123", customerId: "CUST1" });

    await updateReq.execute("REQ1", { status: "ready-for-dispatch" });

    const dispatchedBill = mockBillRepo.save.getCalls().find(call => call[0].lineItems && call[0].lineItems.some(li => li.activityCode === "LIFT"));
    if (dispatchedBill) {
        console.log("PASSED: LIFT bill generated during dispatch.");
        console.log("Line Items:", JSON.stringify(dispatchedBill[0].lineItems, null, 2));
    } else {
        console.error("FAILED: LIFT bill NOT generated during dispatch!");
    }

    console.log("\n--- Verification Finished ---");
}

verify().catch(console.error);
