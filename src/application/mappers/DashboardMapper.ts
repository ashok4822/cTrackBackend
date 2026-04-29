import { Block } from "../../domain/entities/Block";
import { Container } from "../../domain/entities/Container";
import { ContainerHistory, ContainerSummary } from "../../domain/entities/ContainerHistory";
import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { Equipment } from "../../domain/entities/Equipment";
import { DashboardKPIsResponseDto } from "../dto/DashboardDto";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export interface GateMovementRaw {
  day: string;
  type: "gate-in" | "gate-out";
  count: number;
}

export interface EquipmentStatusSummary {
  id: string | null;
  name: string;
  type: string;
  status: string;
}

export interface DashboardRawData {
  totalContainersInYard: number;
  containersInTransit: number;
  gateInToday: number;
  gateOutToday: number;
  blocks: Block[];
  gateMovementsRaw: GateMovementRaw[];
  containersInYard: Container[];
  recentActivitiesRaw: ContainerHistory[];
  pendingRequestsCount: number;
  damagedContainers: Container[];
  equipmentIssues: Equipment[];
  liveQueueRaw: Container[];
  activeTasksRaw: ContainerRequest[];
  equipmentStatusSummary: EquipmentStatusSummary[];
  pdaBalance: number;
  lowBalanceThreshold: number;
  unpaidBillsAmount: number;
  sevenDaysAgo: Date;
}


export class DashboardMapper {
  static toResponseDto(data: DashboardRawData): DashboardKPIsResponseDto {
    const now = new Date();

    // 1. Yard Utilization
    const totalCapacity = data.blocks.reduce((sum, block) => sum + block.capacity, 0);
    const totalOccupied = data.blocks.reduce((sum, block) => sum + block.occupied, 0);
    const yardUtilization = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

    // 2. Gate Movements (Last 7 Days)
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(data.sevenDaysAgo);
      d.setDate(data.sevenDaysAgo.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const dayNum = String(d.getDate()).padStart(2, "0");
      days.push(`${year}-${month}-${dayNum}`);
    }

    const gateMovements = days.map((day) => {
      const dateObj = new Date(day + "T00:00:00");
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

      const gateIn = data.gateMovementsRaw.find((m) => m.day === day && m.type === "gate-in")?.count || 0;
      const gateOut = data.gateMovementsRaw.find((m) => m.day === day && m.type === "gate-out")?.count || 0;

      return { name: dayName, gateIn, gateOut };
    });

    // 3. Dwell Time Distribution
    const buckets = [
      { name: "0-3 Days", value: 0 },
      { name: "3-7 Days", value: 0 },
      { name: "7-15 Days", value: 0 },
      { name: "15+ Days", value: 0 },
    ];

    data.containersInYard.forEach((container) => {
      if (container.gateInTime) {
        const gateInTime = new Date(container.gateInTime);
        const diffDays = Math.max(1, Math.ceil((now.getTime() - gateInTime.getTime()) / (1000 * 60 * 60 * 24)));

        if (diffDays <= 3) buckets[0].value++;
        else if (diffDays <= 7) buckets[1].value++;
        else if (diffDays <= 15) buckets[2].value++;
        else buckets[3].value++;
      }
    });

    const dwellTimeDistribution = buckets.filter((b) => b.value > 0);
    if (dwellTimeDistribution.length === 0) {
      dwellTimeDistribution.push({ name: "0-3 Days", value: 0 });
    }

    // 4. Recent Activity Mapping
    const recentActivities = data.recentActivitiesRaw
      .filter((history) => history.containerId)
      .map((history) => {
        let type = "yard";
        const activity = (history.activity || "").toLowerCase();
        if (activity.includes("gate")) type = "gate";
        if (activity.includes("payment")) type = "payment";
        if (activity.includes("survey")) type = "survey";
        if (activity.includes("approval")) type = "approval"

        const containerNumber = (history.containerId as ContainerSummary)?.containerNumber || "Unknown";

        return {
          id: history.id,
          action: history.activity,
          description: `Container ${containerNumber}: ${history.details || "No details"}`,
          time: history.timestamp ? history.timestamp.toISOString() : now.toISOString(),
          type,
        };
      });

    // 5. Derived Alerts
    const recentAlerts: DashboardKPIsResponseDto["recentAlerts"] = [];

    if (data.pendingRequestsCount > 0) {
      recentAlerts.push({
        id: "pending-requests",
        type: "warning",
        title: ResponseMessage.PENDING_APPROVALS_TITLE,
        message: `There are ${data.pendingRequestsCount} container requests pending approval.`,
        link: "/admin/requests",
      });
    }

    data.damagedContainers.forEach((container) => {
      recentAlerts.push({
        id: `damaged-${container.id}`,
        type: "error",
        title: ResponseMessage.DAMAGED_CONTAINER_TITLE,
        message: `Container ${container.containerNumber} reported with damage: ${container.damageDetails || "No details"}.`,
        link: `/admin/containers`,
      });
    });

    data.equipmentIssues.forEach((eq) => {
      recentAlerts.push({
        id: `eq-${eq.id}`,
        type: eq.status === "down" ? "error" : "info",
        title: eq.status === "down" ? ResponseMessage.EQUIPMENT_DOWN_TITLE : ResponseMessage.EQUIPMENT_MAINTENANCE_TITLE,
        message: `${eq.type} ${eq.name} is currently ${eq.status}.`,
        link: "/admin/vehicles",
      });
    });

    return {
      totalContainersInYard: data.totalContainersInYard,
      containersInTransit: data.containersInTransit,
      gateInToday: data.gateInToday,
      gateOutToday: data.gateOutToday,
      yardUtilization,
      gateMovements,
      dwellTimeDistribution,
      recentActivities,
      recentAlerts,
      liveQueue: data.liveQueueRaw.map((c) => ({
        id: c.id,
        containerNumber: c.containerNumber,
        status: c.status,
        type: c.type,
        updatedAt: c.updatedAt,
      })),
      activeTasks: data.activeTasksRaw.map((t) => ({
        id: t.id,
        type: t.type,
        status: t.status,
        containerNumber: t.containerNumber || "Auto-assign",
        createdAt: t.createdAt,
      })),
      equipmentStatusSummary: data.equipmentStatusSummary,
      pdaBalance: data.pdaBalance,
      lowBalanceThreshold: data.lowBalanceThreshold,
      unpaidBillsAmount: data.unpaidBillsAmount,
    };
  }
}
