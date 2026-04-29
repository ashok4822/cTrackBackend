"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetContainerById = void 0;
const ContainerMapper_1 = require("../mappers/ContainerMapper");
class GetContainerById {
    containerRepository;
    constructor(containerRepository) {
        this.containerRepository = containerRepository;
    }
    async execute(id) {
        const container = await this.containerRepository.findById(id);
        return container ? ContainerMapper_1.ContainerMapper.toResponseDto(container) : null;
    }
}
exports.GetContainerById = GetContainerById;
//# sourceMappingURL=GetContainerById.js.map