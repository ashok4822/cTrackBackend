"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboardKPIs = void 0;
const DashboardMapper_1 = require("../mappers/DashboardMapper");
const EquipmentMapper_1 = require("../mappers/EquipmentMapper");
class GetDashboardKPIs {
    containerRepository;
    gateOperationRepository;
    blockRepository;
    containerHistoryRepository;
    containerRequestRepository;
    equipmentRepository;
    billRepository;
    pdaRepository;
    idValidator;
    configService;
    constructor(containerRepository, gateOperationRepository, blockRepository, containerHistoryRepository, containerRequestRepository, equipmentRepository, billRepository, pdaRepository, idValidator, configService) {
        this.containerRepository = containerRepository;
        this.gateOperationRepository = gateOperationRepository;
        this.blockRepository = blockRepository;
        this.containerHistoryRepository = containerHistoryRepository;
        this.containerRequestRepository = containerRequestRepository;
        this.equipmentRepository = equipmentRepository;
        this.billRepository = billRepository;
        this.pdaRepository = pdaRepository;
        this.idValidator = idValidator;
        this.configService = configService;
    }
    async execute(request) {
        const { role, customerName, userId } = request;
        const isCustomer = role === "customer";
        const containerFilter = isCustomer && userId ? { customer: userId } : {};
        const requestFilter = isCustomer && userId ? { customerId: userId } : {};
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
            ? { containerId: ownedContainerIds }
            : {};
        const [totalContainersInYard, containersInTransit, gateInToday, gateOutToday, blocks, gateMovementsRaw, containersInYard, recentActivitiesRaw, pendingRequestsCount, damagedContainers, equipmentIssues, liveQueueRaw, activeTasksRaw, equipmentStatusSummary, pdaData, unpaidBillsRaw,] = await Promise.all([
            this.containerRepository.countByStatus(["gate-in", "in-yard", "damaged"], containerFilter),
            this.containerRepository.countByStatus("in-transit", containerFilter),
            this.gateOperationRepository.count({
                type: "gate-in",
                startDate: startOfDay,
                ...(isCustomer
                    ? {
                        containerNumber: await this.containerRepository.getDistinctContainerNumbers(containerFilter),
                    }
                    : {}),
            }),
            this.gateOperationRepository.count({
                type: "gate-out",
                startDate: startOfDay,
                ...(isCustomer
                    ? {
                        containerNumber: await this.containerRepository.getDistinctContainerNumbers(containerFilter),
                    }
                    : {}),
            }),
            this.blockRepository.findAll(),
            this.gateOperationRepository.getDailyMovements({
                startDate: sevenDaysAgo,
                ...(isCustomer
                    ? {
                        containerNumber: await this.containerRepository.getDistinctContainerNumbers(containerFilter),
                    }
                    : {}),
            }),
            this.containerRepository.findInYard(containerFilter),
            this.containerHistoryRepository.findRecent(historyFilter, 10),
            this.containerRequestRepository.countPending(requestFilter),
            this.containerRepository.findRecent({ ...containerFilter, damaged: true }, 5),
            this.equipmentRepository.findByStatus(["down", "maintenance"]),
            this.containerRepository.findRecent({
                ...containerFilter,
                status: ["gate-in", "gate-out", "in-transit"],
            }, 10),
            this.containerRequestRepository.findRecent({
                ...requestFilter,
                status: ["pending", "approved", "ready-for-dispatch"],
            }, 10),
            this.equipmentRepository.findAll().then(eq => eq.map(e => EquipmentMapper_1.EquipmentMapper.toSummaryDto(e))),
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
        return DashboardMapper_1.DashboardMapper.toResponseDto({
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
exports.GetDashboardKPIs = GetDashboardKPIs;
//# sourceMappingURL=GetDashboardKPIs.js.map