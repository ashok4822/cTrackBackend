import type { IContainerRepository, ContainerFilter } from "../../domain/repositories/IContainerRepository";
import type { IGateOperationRepository } from "../../domain/repositories/IGateOperationRepository";
import type { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import type { IContainerHistoryRepository, ContainerHistoryFilter } from "../../domain/repositories/IContainerHistoryRepository";
import type { IContainerRequestRepository, ContainerRequestFilter } from "../../domain/repositories/IContainerRequestRepository";
import type { IEquipmentRepository } from "../../domain/repositories/IEquipmentRepository";
import type { IBillRepository } from "../../domain/repositories/IBillRepository";
import type { IPDARepository } from "../../domain/repositories/IPDARepository";
import { IGetDashboardKPIs } from "../ports/IGetDashboardKPIs";
import { DashboardKPIsResponseDto, GetDashboardKPIsRequestDto } from "../dto/DashboardDto";
import { IIdValidator } from "../../domain/services/IIdValidator";
import { IConfigService } from "../services/IConfigService";
import { DashboardMapper } from "../mappers/DashboardMapper";
import { EquipmentMapper } from "../mappers/EquipmentMapper";

export class GetDashboardKPIs implements IGetDashboardKPIs {
  constructor(
    private containerRepository: IContainerRepository,
    private gateOperationRepository: IGateOperationRepository,
    private blockRepository: IBlockRepository,
    private containerHistoryRepository: IContainerHistoryRepository,
    private containerRequestRepository: IContainerRequestRepository,
    private equipmentRepository: IEquipmentRepository,
    private billRepository: IBillRepository,
    private pdaRepository: IPDARepository,
    private idValidator: IIdValidator,
    private configService: IConfigService,
  ) {}

  async execute(request: GetDashboardKPIsRequestDto): Promise<DashboardKPIsResponseDto> {
    const { role, customerName, userId } = request;
    const isCustomer = role === "customer";
    const containerFilter: ContainerFilter =
      isCustomer && userId ? { customer: userId } : {};
    const requestFilter: ContainerRequestFilter =
      isCustomer && userId ? { customerId: userId } : {};

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const ownedContainerIds = isCustomer
      ? (await this.containerRepository.getDistinctContainerIds(containerFilter))
      : null;
    const historyFilter: ContainerHistoryFilter = ownedContainerIds
      ? { containerId: ownedContainerIds }
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
      equipmentStatusSummary,
      pdaData,
      unpaidBillsRaw,
    ] = await Promise.all([
      this.containerRepository.countByStatus(
        ["gate-in", "in-yard", "damaged"],
        containerFilter,
      ),
      this.containerRepository.countByStatus("in-transit", containerFilter),
      this.gateOperationRepository.count({
        type: "gate-in",
        startDate: startOfDay,
        ...(isCustomer
          ? {
              containerNumber: await this.containerRepository.getDistinctContainerNumbers(
                containerFilter,
              ),
            }
          : {}),
      }),
      this.gateOperationRepository.count({
        type: "gate-out",
        startDate: startOfDay,
        ...(isCustomer
          ? {
              containerNumber: await this.containerRepository.getDistinctContainerNumbers(
                containerFilter,
              ),
            }
          : {}),
      }),
      this.blockRepository.findAll(),
      this.gateOperationRepository.getDailyMovements({
        startDate: sevenDaysAgo,
        ...(isCustomer
          ? {
              containerNumber: await this.containerRepository.getDistinctContainerNumbers(
                containerFilter,
              ),
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
          status: ["gate-in", "gate-out", "in-transit"],
        },
        10,
      ),
      this.containerRequestRepository.findRecent(
        {
          ...requestFilter,
          status: ["pending", "approved", "ready-for-dispatch"],
        },
        10,
      ),
      this.equipmentRepository.findAll().then(eq => eq.map(e => EquipmentMapper.toSummaryDto(e))),
      isCustomer
        ? this.pdaRepository.findByUserOrCustomer(userId, customerName)
        : Promise.resolve(null),
      isCustomer
        ? this.billRepository.aggregateUnpaidAmount({
            customerId: userId,
            customerName,
            excludeStatus: "paid",
          })
        : Promise.resolve([]),
    ]);

    return DashboardMapper.toResponseDto({
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
      equipmentStatusSummary,
      pdaBalance: pdaData?.balance || 0,
      lowBalanceThreshold: this.configService.getNumber('PDA_LOW_BALANCE_THRESHOLD'),
      unpaidBillsAmount: unpaidBillsRaw?.[0]?.total || 0,
      sevenDaysAgo
    });
  }
}

