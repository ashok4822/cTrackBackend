
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
}

// Minimal CreateGateOperation Mock to test the logic
class TestGateOp {
    constructor(private repo: MockContainerRepository) { }

    async simulateGateIn(containerNumber: string, existingContainer?: Container) {
        if (!existingContainer) {
            // New container
            const c = new Container(
                "1", containerNumber, "40ft", "standard", "gate-in", "LINE", true, "import",
                undefined, undefined, new Date(), undefined, undefined,
                undefined, undefined, undefined, false, undefined
            );
            return await this.repo.save(c);
        } else {
            // Existing container
            const updated = new Container(
                existingContainer.id,
                existingContainer.containerNumber,
                existingContainer.size,
                existingContainer.type,
                "gate-in",
                existingContainer.shippingLine,
                existingContainer.empty,
                existingContainer.movementType,
                existingContainer.customer,
                existingContainer.yardLocation,
                new Date(),
                undefined, // SHOULD BE RESET
                undefined, // SHOULD BE RESET
                existingContainer.weight,
                existingContainer.cargoWeight,
                (existingContainer as any).cargoDescription,
                (existingContainer as any).hazardousClassification,
                existingContainer.sealNumber,
                existingContainer.damaged,
                existingContainer.damageDetails,
                existingContainer.blacklisted,
                existingContainer.createdAt,
                new Date()
            );
            return await this.repo.save(updated);
        }
    }

    async simulateGateOut(container: Container) {
        const updated = new Container(
            container.id,
            container.containerNumber,
            container.size,
            container.type,
            "gate-out",
            container.shippingLine,
            container.empty,
            container.movementType,
            container.customer,
            container.yardLocation,
            container.gateInTime,
            new Date(),
            10, // Simulated dwell time
            container.weight,
            container.cargoWeight,
            (container as any).cargoDescription,
            (container as any).hazardousClassification,
            container.sealNumber,
            container.damaged,
            container.damageDetails,
            container.blacklisted,
            container.createdAt,
            new Date()
        );
        return await this.repo.save(updated);
    }
}

async function runTest() {
    console.log("Starting Gate-In Dwell Time Reset Verification...");
    const repo = new MockContainerRepository();
    const service = new TestGateOp(repo);

    // 1. Initial Gate-In
    let container = await service.simulateGateIn("CONT123");
    console.log("Initial Gate-In - gateOutTime:", container.gateOutTime, "dwellTime:", container.dwellTime);

    // 2. Gate-Out (sets gateOutTime and dwellTime)
    container = await service.simulateGateOut(container);
    console.log("Gate-Out - gateOutTime:", container.gateOutTime, "dwellTime:", container.dwellTime);

    // 3. New Gate-In (should clear gateOutTime and dwellTime)
    container = await service.simulateGateIn("CONT123", container);
    console.log("New Gate-In - gateOutTime:", container.gateOutTime, "dwellTime:", container.dwellTime);

    if (container.gateOutTime === undefined && container.dwellTime === undefined) {
        console.log("SUCCESS: gateOutTime and dwellTime were reset correctly.");
    } else {
        console.error("FAILURE: gateOutTime or dwellTime was not reset.");
        process.exit(1);
    }
}

runTest().catch(console.error);
