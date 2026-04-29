"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCustomerContainers = void 0;
const ContainerMapper_1 = require("../mappers/ContainerMapper");
class GetCustomerContainers {
    containerRepository;
    containerRequestRepository;
    constructor(containerRepository, containerRequestRepository) {
        this.containerRepository = containerRepository;
        this.containerRequestRepository = containerRequestRepository;
    }
    async execute(customerName, customerId) {
        // Fetch all active containers for this customer (used by both 'My Containers' page
        // and as the pool from which the destuffing dropdown filters client-side)
        const containers = await this.containerRepository.findAll({
            customer: customerId,
            status: ["gate-in", "in-yard", "in-transit", "at-port", "at-factory", "damaged"]
        });
        // Fetch active requests for this customer
        const activeRequests = await this.containerRequestRepository.findActiveRequestsByCustomerId(customerId);
        // Filter out containers that already have an active destuffing request
        const containersWithActiveRequests = new Set(activeRequests
            .filter((r) => r.type === "destuffing" && r.containerId)
            .map((r) => r.containerId));
        return containers
            .filter((c) => c.id && !containersWithActiveRequests.has(c.id))
            .map(c => ContainerMapper_1.ContainerMapper.toResponseDto(c));
    }
}
exports.GetCustomerContainers = GetCustomerContainers;
//# sourceMappingURL=GetCustomerContainers.js.map