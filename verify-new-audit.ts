import { BlacklistContainer } from "./src/application/useCases/BlacklistContainer";
import { UnblacklistContainer } from "./src/application/useCases/UnblacklistContainer";
import { CreateGateOperation } from "./src/application/useCases/CreateGateOperation";
import { AuditLog } from "./src/domain/entities/AuditLog";

async function verifyAdditionalAudit() {
  console.log("--- Starting Additional Audit Logging Verification ---");

  const auditActions: string[] = [];

  const mockAuditLogRepo = {
    save: async (log: AuditLog) => {
      auditActions.push(log.action);
      console.log(
        `  ✅ [AuditLog] action=${log.action}, entity=${log.entityType}, details=${log.details}`,
      );
      return Promise.resolve();
    },
    findAll: async () => [],
    findById: async () => null,
  };

  const baseContainer = {
    id: "c1",
    containerNumber: "CONT123456",
    size: "20ft",
    type: "standard",
    shippingLine: "MSK",
    blacklisted: false,
    empty: false,
    movementType: "import",
    customer: null,
    customerName: null,
    yardLocation: null,
    gateInTime: null,
    gateOutTime: null,
    dwellTime: null,
    weight: null,
    cargoWeight: null,
    sealNumber: null,
    damaged: false,
    damageDetails: null,
    cargoCategory: null,
    cargoDescription: null,
    hazardousClassification: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockHistoryRepo: any = { save: async () => Promise.resolve() };
  const mockAuditRepo: any = mockAuditLogRepo;
  const mockURepo: any = { findById: async () => null };
  const mockBRepo: any = {
    findByName: async () => null,
    save: async () => Promise.resolve(),
  };

  const userContext = {
    userId: "admin-id",
    userName: "Admin User",
    userRole: "admin",
    ipAddress: "127.0.0.1",
  };

  // --- BlacklistContainer ---
  console.log("\nTesting BlacklistContainer...");
  const blacklistRepo: any = {
    findById: async () => ({ ...baseContainer }),
    save: async (_c: any) => Promise.resolve(),
  };
  const blacklistUseCase = new BlacklistContainer(
    blacklistRepo,
    mockHistoryRepo,
    mockAuditRepo,
  );
  await blacklistUseCase.execute("c1", userContext);

  // --- UnblacklistContainer ---
  console.log("\nTesting UnblacklistContainer...");
  const unblacklistRepo: any = {
    findById: async () => ({ ...baseContainer, blacklisted: true }),
    save: async (_c: any) => Promise.resolve(),
  };
  const unblacklistUseCase = new UnblacklistContainer(
    unblacklistRepo,
    mockHistoryRepo,
    mockAuditRepo,
  );
  await unblacklistUseCase.execute("c1", userContext);

  // --- Gate-In ---
  console.log("\nTesting CreateGateOperation (Gate-In)...");
  const gateInContainerRepo: any = {
    findById: async () => null,
    findAll: async (_f: any) => [{ ...baseContainer, status: "gate-out" }],
    save: async (c: any) => ({ ...c, id: "c1" }),
  };
  const gateInUseCase = new CreateGateOperation(
    { save: async () => Promise.resolve() } as any,
    { findAll: async () => [], save: async () => Promise.resolve() } as any,
    gateInContainerRepo,
    mockHistoryRepo,
    { findByContainerNumber: async () => null } as any,
    mockURepo,
    mockBRepo,
    mockAuditRepo,
  );
  await gateInUseCase.execute(
    {
      type: "gate-in",
      containerNumber: "CONT123456",
      vehicleNumber: "V123",
      driverName: "Driver X",
      purpose: "port",
    },
    userContext,
  );

  // --- Gate-Out ---
  console.log("\nTesting CreateGateOperation (Gate-Out)...");
  const gateOutContainerRepo: any = {
    findById: async () => null,
    findAll: async (_f: any) => [
      { ...baseContainer, status: "gate-in", yardLocation: null },
    ],
    save: async (c: any) => ({ ...c, id: "c1" }),
  };
  const gateOutBillRepo: any = { findByContainerId: async () => [] };
  const gateOutUseCase = new CreateGateOperation(
    { save: async () => Promise.resolve() } as any,
    { findAll: async () => [], save: async () => Promise.resolve() } as any,
    gateOutContainerRepo,
    mockHistoryRepo,
    { findByContainerNumber: async () => null } as any,
    mockURepo,
    mockBRepo,
    mockAuditRepo,
    gateOutBillRepo,
  );
  await gateOutUseCase.execute(
    {
      type: "gate-out",
      containerNumber: "CONT123456",
      vehicleNumber: "V123",
      driverName: "Driver X",
      purpose: "factory",
    },
    userContext,
  );

  console.log("\n--- Verification Complete ---");
  console.log(`Actions logged: ${auditActions.join(", ")}`);

  const expected = [
    "CONTAINER_BLACKLISTED",
    "CONTAINER_UNBLACKLISTED",
    "CONTAINER_GATE_IN",
    "CONTAINER_GATE_OUT",
  ];
  const allPassed = expected.every((a) => auditActions.includes(a));
  console.log(
    allPassed
      ? "\n✅ All audit actions verified!"
      : "\n❌ Some audit actions missing: " +
          expected.filter((a) => !auditActions.includes(a)).join(", "),
  );
}

verifyAdditionalAudit().catch(console.error);
