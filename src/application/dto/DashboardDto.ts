export class GetDashboardKPIsRequestDto {
  role?: string;
  customerName?: string;
  userId?: string;
}

export class DashboardKPIsResponseDto {
  totalContainersInYard!: number;
  containersInTransit!: number;
  gateInToday!: number;
  gateOutToday!: number;
  yardUtilization!: number;
  gateMovements!: Array<{ name: string; gateIn: number; gateOut: number }>;
  dwellTimeDistribution!: Array<{ name: string; value: number }>;
  recentActivities!: Array<{
    id: string | null;
    action: string;
    description: string;
    time: string;
    type: string;
  }>;
  recentAlerts!: Array<{
    id: string | null;
    type: string;
    title: string;
    message: string;
    link: string;
  }>;
  liveQueue!: Array<{
    id: string | null;
    containerNumber: string;
    status: string;
    type: string;
    updatedAt?: Date;
  }>;
  activeTasks!: Array<{
    id: string | null;
    type: string;
    status: string;
    containerNumber: string;
    createdAt?: Date;
  }>;
  equipmentStatusSummary!: Array<{
    id: string | null;
    name: string;
    type: string;
    status: string;
  }>;
  pdaBalance!: number;
  lowBalanceThreshold!: number;
  unpaidBillsAmount!: number;
}
