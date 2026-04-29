"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCargoCategories = void 0;
const CargoMapper_1 = require("../mappers/CargoMapper");
class GetCargoCategories {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        const categories = await this.repository.findAll();
        return CargoMapper_1.CargoMapper.toCollectionResponseDto(categories);
    }
}
exports.GetCargoCategories = GetCargoCategories;
//# sourceMappingURL=GetCargoCategories.js.map