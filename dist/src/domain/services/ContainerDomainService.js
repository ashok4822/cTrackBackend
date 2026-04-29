"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerDomainService = void 0;
const Container_1 = require("../../domain/entities/Container");
class ContainerDomainService {
    containerRepository;
    userRepository;
    constructor(containerRepository, userRepository) {
        this.containerRepository = containerRepository;
        this.userRepository = userRepository;
    }
    async findByNumber(containerNumber) {
        const containers = await this.containerRepository.findAll({ containerNumber });
        return containers.length > 0 ? containers[0] : null;
    }
    async getCustomerName(customerId) {
        const user = await this.userRepository.findById(customerId);
        return user ? (user.companyName || user.name || customerId) : customerId;
    }
    async processGateIn(data, existingContainer) {
        let customerName = data.customer;
        if (data.customer) {
            customerName = await this.getCustomerName(data.customer);
        }
        if (!existingContainer) {
            const container = new Container_1.Container(null, data.containerNumber || "Unknown", data.size || "40ft", data.containerType || "standard", "gate-in", data.shippingLine || "Unknown", data.empty ?? true, data.movementType || "import", data.customer, customerName, undefined, new Date(), undefined, undefined, data.weight, data.cargoWeight, data.cargoDescription, data.hazardousClassification, data.sealNumber, false, undefined, false, data.cargoCategory, new Date(), new Date());
            return container;
        }
        else {
            return new Container_1.Container(existingContainer.id, existingContainer.containerNumber, data.size || existingContainer.size, data.containerType || existingContainer.type, "gate-in", data.shippingLine || existingContainer.shippingLine, data.empty ?? existingContainer.empty, data.movementType || existingContainer.movementType, data.customer || existingContainer.customer, customerName || existingContainer.customerName, existingContainer.yardLocation, new Date(), undefined, undefined, data.weight ?? existingContainer.weight, data.cargoWeight ?? existingContainer.cargoWeight, data.cargoDescription ?? existingContainer.cargoDescription, data.hazardousClassification ?? existingContainer.hazardousClassification, data.sealNumber ?? existingContainer.sealNumber, existingContainer.damaged, existingContainer.damageDetails, existingContainer.blacklisted, data.cargoCategory || existingContainer.cargoCategory, existingContainer.createdAt, new Date());
        }
    }
    async processGateOut(container) {
        return new Container_1.Container(container.id, container.containerNumber, container.size, container.type, "gate-out", container.shippingLine, container.empty, container.movementType, container.customer, container.customerName, undefined, container.gateInTime, new Date(), container.dwellTime, container.weight, container.cargoWeight, container.cargoDescription, container.hazardousClassification, container.sealNumber, container.damaged, container.damageDetails, container.blacklisted, container.cargoCategory, container.createdAt, new Date());
    }
}
exports.ContainerDomainService = ContainerDomainService;
//# sourceMappingURL=ContainerDomainService.js.map