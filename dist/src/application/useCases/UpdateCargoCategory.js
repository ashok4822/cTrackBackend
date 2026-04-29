"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCargoCategory = void 0;
const CargoMapper_1 = require("../mappers/CargoMapper");
class UpdateCargoCategory {
    cargoCategoryRepository;
    constructor(cargoCategoryRepository) {
        this.cargoCategoryRepository = cargoCategoryRepository;
    }
    async execute(id, data) {
        const updated = await this.cargoCategoryRepository.update(id, data);
        return updated ? CargoMapper_1.CargoMapper.toResponseDto(updated) : null;
    }
}
exports.UpdateCargoCategory = UpdateCargoCategory;
//# sourceMappingURL=UpdateCargoCategory.js.map