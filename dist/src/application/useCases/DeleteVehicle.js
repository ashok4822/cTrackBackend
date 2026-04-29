"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteVehicle = void 0;
class DeleteVehicle {
    vehicleRepository;
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async execute(id) {
        await this.vehicleRepository.delete(id);
    }
}
exports.DeleteVehicle = DeleteVehicle;
//# sourceMappingURL=DeleteVehicle.js.map