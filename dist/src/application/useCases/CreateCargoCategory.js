"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCargoCategory = void 0;
const CargoMapper_1 = require("../mappers/CargoMapper");
class CreateCargoCategory {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(data) {
        const category = CargoMapper_1.CargoMapper.toEntity(data);
        const saved = await this.repository.save(category);
        return CargoMapper_1.CargoMapper.toResponseDto(saved);
    }
}
exports.CreateCargoCategory = CreateCargoCategory;
//# sourceMappingURL=CreateCargoCategory.js.map