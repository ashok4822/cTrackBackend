"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllContainers = void 0;
const ContainerMapper_1 = require("../mappers/ContainerMapper");
class GetAllContainers {
    containerRepository;
    constructor(containerRepository) {
        this.containerRepository = containerRepository;
    }
    async execute(filters) {
        // ContainerFiltersDto is structurally compatible with ContainerFilter
        const containers = await this.containerRepository.findAll(filters);
        return ContainerMapper_1.ContainerMapper.toCollectionResponseDto(containers);
    }
}
exports.GetAllContainers = GetAllContainers;
//# sourceMappingURL=GetAllContainers.js.map