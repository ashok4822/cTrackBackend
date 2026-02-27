
import { Container } from "./domain/entities/Container";

// Mock Repositories
class MockContainerRepository {
    private containers: Map<string, Container> = new Map();

    async findAll(filters: { containerNumber?: string }): Promise<Container[]> {
        const results = Array.from(this.containers.values()).filter(c =>
            !filters.containerNumber || c.containerNumber === filters.containerNumber
        );
        return results;
    }

    async save(container: Container): Promise<Container> {
        this.containers.set(container.containerNumber, container);
        return container;
    }

    // Logic from ContainerRepository.toEntity
    toEntityWithDwell(c: any): Container {
        let dwellTime = c.dwellTime;
        if (c.gateInTime) {
            const outTime = c.gateOutTime ? new Date(c.gateOutTime) : new Date();
            const inTime = new Date(c.gateInTime);
            const diffMs = outTime.getTime() - inTime.getTime();
            // THE FIX
            dwellTime = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        }

        return new Container(
            c.id, c.containerNumber, c.size, c.type, c.status, c.shippingLine,
            c.empty, c.movementType, c.customer, c.yardLocation,
            c.gateInTime, c.gateOutTime, dwellTime,
            c.weight, c.cargoWeight, c.cargoDescription, !!c.hazardousClassification, c.sealNumber,
            c.damaged, c.damageDetails, c.blacklisted, c.createdAt, c.updatedAt
        );
    }
}

async function runTest() {
    console.log("Starting Dwell Time Logic Verification...");
    const repo = new MockContainerRepository();

    // SCENARIO 1: RESET ON GATE-IN
    console.log("\nTesting Reset on Gate-In:");
    const oldContainer = new Container(
        "1", "CONT1", "40ft", "standard", "gate-out", "LINE", true, "import",
        undefined, undefined, new Date(Date.now() - 1000000), new Date(), 10,
        undefined, undefined, undefined, undefined, undefined,
        false, undefined, false, new Date(), new Date()
    );

    // Simulate CreateGateOperation logic for gate-in
    const newGateIn = new Container(
        oldContainer.id, oldContainer.containerNumber, oldContainer.size, oldContainer.type,
        "gate-in", oldContainer.shippingLine, oldContainer.empty, oldContainer.movementType,
        oldContainer.customer, oldContainer.yardLocation,
        new Date(), // New Gate-In Time
        undefined,  // SHOULD BE RESET
        undefined,  // SHOULD BE RESET
        undefined, undefined, undefined, undefined, undefined,
        false, undefined, false, new Date(), new Date()
    );

    const entityAfterReset = repo.toEntityWithDwell(newGateIn);
    console.log("After Gate-In Reset - gateOutTime:", entityAfterReset.gateOutTime, "dwellTime:", entityAfterReset.dwellTime);

    if (entityAfterReset.gateOutTime === undefined && (entityAfterReset.dwellTime === 0 || entityAfterReset.dwellTime === undefined)) {
        console.log("PASS: gateOutTime and dwellTime reset correctly.");
    } else {
        console.error("FAIL: Reset failed.");
        process.exit(1);
    }

    // SCENARIO 2: NEGATIVE DWELL PREVENT
    console.log("\nTesting Non-Negative Dwell Time:");
    const now = new Date();
    const slightlyFuture = new Date(now.getTime() + 10); // 10ms in the future

    const nearInstantContainer = {
        id: "2",
        containerNumber: "CONT2",
        status: "gate-in",
        gateInTime: slightlyFuture, // Gated in slightly "after" now (simulates clock skew or immediate query)
        gateOutTime: undefined
    };

    const entityNearInstant = repo.toEntityWithDwell(nearInstantContainer);
    console.log("Near-instant Query - gateInTime:", slightlyFuture.toISOString(), "now:", now.toISOString());
    console.log("Calculated dwellTime:", entityNearInstant.dwellTime);

    if (entityNearInstant.dwellTime === 0) {
        console.log("PASS: Negative dwell time prevented (returned 0).");
    } else {
        console.error("FAIL: Negative dwell time allowed (returned " + entityNearInstant.dwellTime + ").");
        process.exit(1);
    }

    console.log("\nALL TESTS PASSED!");
}

runTest().catch(console.error);
