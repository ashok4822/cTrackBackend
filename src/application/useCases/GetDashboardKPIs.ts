import { IContainerRepository, ContainerFilter } from "../../domain/repositories/IContainerRepository";
import { IGateOperationRepository } from "../../domain/repositories/IGateOperationRepository";
import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { IContainerRequestRepository, ContainerRequestFilter } from "../../domain/repositories/IContainerRequestRepository";
import { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { IPDARepository } from "../../domain/repositories/IPDARepository";
import { appConfig } from "../../infrastructure/config/appConfig";
import mongoose from "mongoose";

interface DashboardAlert {
  id: string;
  type: "info" | "warning" | "error";
  title: string;
  message: string;
  link: string;
}



// Using ContainerRequestFilter from repository instead of local RequestFilter

export class GetDashboardKPIs {
  constructor(
    private containerRepository: IContainerRepository,
    private gateOperationRepository: IGateOperationRepository,
    private blockRepository: IBlockRepository,
    private containerHistoryRepository: IContainerHistoryRepository,
    private containerRequestRepository: IContainerRequestRepository,
    private equipmentRepository: IEquipmentRepository,
    private billRepository: IBillRepository,
    private pdaRepository: IPDARepository,
  ) {}

  async execute(role?: string, customerName?: string, userId?: string) {
    const isCustomer = role === "customer";
    // ContainerModel.customer stores user._id as string (ObjectId), not company name
    // ContainerRepository.mapWithCustomers resolves it to display name via User lookup
    const containerFilter: ContainerFilter =
      isCustomer && userId ? { customer: userId } : {};
    // ContainerRequestModel.customerId stores user.id (MongoDB ObjectId as string)
    const requestFilter: ContainerRequestFilter =
      isCustomer && userId ? { customerId: userId } : {};

    // Resilient PDA lookup: try userId first, fallback to customer name
    const pdaFilter = isCustomer
      ? {
          $or: [
            ...(userId && mongoose.Types.ObjectId.isValid(userId)
              ? [{ userId: new mongoose.Types.ObjectId(userId) }]
              : []),
            { customer: customerName },
          ],
        }
      : null;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const ownedContainerIds = isCustomer
      ? (await this.containerRepository.getDistinctContainerIds(containerFilter))
      : null;
    const historyFilter = ownedContainerIds
      ? { containerId: { $in: ownedContainerIds } }
      : {};

    const [
      totalContainersInYard,
      containersInTransit,
      gateInToday,
      gateOutToday,
      blocks,
      gateMovementsRaw,
      containersInYard,
      recentActivitiesRaw,
      pendingRequestsCount,
      damagedContainers,
      equipmentIssues,
      liveQueueRaw,
      activeTasksRaw,
      allEquipment,
      pdaData,
      unpaidBillsRaw,
    ] = await Promise.all([
      this.containerRepository.countByStatus(
        ["gate-in", "in-yard", "damaged"],
        containerFilter,
      ),
      this.containerRepository.countByStatus("in-transit", containerFilter),
      this.gateOperationRepository.countDocuments({
        type: "gate-in",
        timestamp: { $gte: startOfDay },
        ...(isCustomer
          ? {
              containerNumber: {
                $in: await this.containerRepository.getDistinctContainerNumbers(
                  containerFilter,
                ),
              },
            }
          : {}),
      }),
      this.gateOperationRepository.countDocuments({
        type: "gate-out",
        timestamp: { $gte: startOfDay },
        ...(isCustomer
          ? {
              containerNumber: {
                $in: await this.containerRepository.getDistinctContainerNumbers(
                  containerFilter,
                ),
              },
            }
          : {}),
      }),
      this.blockRepository.findAll(),
      this.gateOperationRepository.getDailyMovements({
        timestamp: { $gte: sevenDaysAgo },
        ...(isCustomer
          ? {
              containerNumber: {
                $in: await this.containerRepository.getDistinctContainerNumbers(
                  containerFilter,
                ),
              },
            }
          : {}),
      }),
      this.containerRepository.findInYard(containerFilter),
      this.containerHistoryRepository.findRecent(historyFilter, 10),
      this.containerRequestRepository.countPending(requestFilter),
      this.containerRepository.findRecent({ ...containerFilter, damaged: true }, 5),
      this.equipmentRepository.findByStatus(["down", "maintenance"]),
      this.containerRepository.findRecent(
        {
          ...containerFilter,
          status: { $in: ["gate-in", "gate-out", "in-transit"] },
        },
        10,
      ),
      this.containerRequestRepository.findRecent(
        {
          ...requestFilter,
          status: { $in: ["pending", "approved", "ready-for-dispatch"] },
        },
        10,
      ),
      this.equipmentRepository.findAll(),
      // 34. Customer specific financial data
      isCustomer && pdaFilter
        ? this.pdaRepository.findOne(pdaFilter)
        : Promise.resolve(null),
      isCustomer
        ? this.billRepository.aggregateUnpaidAmount({
            $or: [
              ...(userId ? [{ customer: userId }] : []),
              ...(customerName ? [{ customer: customerName }] : []),
            ],
            status: { $ne: "paid" },
          })
        : Promise.resolve([]),
    ]);

    // ... intermediate logic ...

    // 6. Operator Specific Data
    const liveQueue = liveQueueRaw.map((c) => ({
      id: c.id,
      containerNumber: c.containerNumber,
      status: c.status,
      type: c.type,
      updatedAt: c.updatedAt,
    }));

    const activeTasks = activeTasksRaw.map((t) => ({
      id: t.id,
      type: t.type,
      status: t.status,
      containerNumber: t.containerNumber || "Auto-assign",
      createdAt: t.createdAt,
    }));

    const equipmentStatusSummary = allEquipment.map((e) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      status: e.status,
    }));

    // 1. Yard Utilization
    const totalCapacity = blocks.reduce(
      (sum, block) => sum + block.capacity,
      0,
    );
    const totalOccupied = blocks.reduce(
      (sum, block) => sum + block.occupied,
      0,
    );
    const yardUtilization =
      totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

    // 2. Gate Movements (Last 7 Days)
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      // Use local date string instead of toISOString to avoid UTC shift
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const dayNum = String(d.getDate()).padStart(2, "0");
      days.push(`${year}-${month}-${dayNum}`);
    }

    const gateMovements = days.map((day) => {
      const dateObj = new Date(day + "T00:00:00"); // Ensure it's parsed as local midnight
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

      const gateIn =
        gateMovementsRaw.find(
          (m) => m._id.day === day && m._id.type === "gate-in",
        )?.count || 0;
      const gateOut =
        gateMovementsRaw.find(
          (m) => m._id.day === day && m._id.type === "gate-out",
        )?.count || 0;

      return { name: dayName, gateIn, gateOut };
    });

    // 3. Dwell Time Distribution
    const buckets = [
      { name: "0-3 Days", value: 0 },
      { name: "3-7 Days", value: 0 },
      { name: "7-15 Days", value: 0 },
      { name: "15+ Days", value: 0 },
    ];

    containersInYard.forEach((container) => {
      if (container.gateInTime) {
        const gateInTime = new Date(container.gateInTime);
        const diffDays = Math.floor(
          (now.getTime() - gateInTime.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays <= 3) buckets[0].value++;
        else if (diffDays <= 7) buckets[1].value++;
        else if (diffDays <= 15) buckets[2].value++;
        else buckets[3].value++;
      }
    });

    const dwellTimeDistribution = buckets.filter((b) => b.value > 0);
    // Fallback for UI if empty
    if (dwellTimeDistribution.length === 0) {
      dwellTimeDistribution.push({ name: "0-3 Days", value: 0 });
    }

    // 4. Recent Activity Mapping
    const recentActivities = recentActivitiesRaw
      .filter((history) => history.containerId) // Only show if container was successfully populated (belongs to customer if filter was active)
      .map((history) => {
        let type = "yard";
        const activity = (history.activity || "").toLowerCase();
        if (activity.includes("gate")) type = "gate";
        if (activity.includes("payment")) type = "payment";
        if (activity.includes("survey")) type = "survey";
        if (activity.includes("approval")) type = "approval";

        const containerNumber =
          (history.containerId as unknown as { containerNumber: string })?.containerNumber || "Unknown";

        return {
          id: history.id,
          action: history.activity,
          description: `Container ${containerNumber}: ${history.details || "No details"}`,
          time: history.timestamp ? history.timestamp.toISOString() : new Date().toISOString(),
          type,
        };
      });

    // 5. Derived Alerts
    const recentAlerts: DashboardAlert[] = [];

    if (pendingRequestsCount > 0) {
      recentAlerts.push({
        id: "pending-requests",
        type: "warning",
        title: "Pending Approvals",
        message: `There are ${pendingRequestsCount} container requests pending approval.`,
        link: "/admin/requests",
      });
    }

    damagedContainers.forEach((container) => {
      recentAlerts.push({
        id: `damaged-${container.id}`,
        type: "error",
        title: "Damaged Container",
        message: `Container ${container.containerNumber} reported with damage: ${container.damageDetails || "No details"}.`,
        link: `/admin/containers`,
      });
    });

    equipmentIssues.forEach((eq) => {
      recentAlerts.push({
        id: `eq-${eq.id}`,
        type: eq.status === "down" ? "error" : "info",
        title:
          eq.status === "down" ? "Equipment Down" : "Equipment Maintenance",
        message: `${eq.type} ${eq.name} is currently ${eq.status}.`,
        link: "/admin/vehicles",
      });
    });

    return {
      totalContainersInYard,
      containersInTransit,
      gateInToday,
      gateOutToday,
      yardUtilization,
      gateMovements,
      dwellTimeDistribution,
      recentActivities,
      recentAlerts,
      liveQueue,
      activeTasks,
      equipmentStatusSummary,
      pdaBalance: pdaData?.balance || 0,
      lowBalanceThreshold: appConfig.pda.lowBalanceThreshold,
      unpaidBillsAmount: unpaidBillsRaw?.[0]?.total || 0,
    };
  }
}
