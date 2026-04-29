"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCharge = void 0;
const ChargeMapper_1 = require("../mappers/ChargeMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateCharge {
    chargeRepository;
    constructor(chargeRepository) {
        this.chargeRepository = chargeRepository;
    }
    async execute(chargeDto) {
        const chargeData = ChargeMapper_1.ChargeMapper.toEntity(chargeDto);
        const existing = await this.chargeRepository.findByCriteria(chargeData.activityId, chargeData.containerSize, chargeData.containerType);
        if (existing) {
            throw new AppError_1.AppError(`${ResponseMessage_1.ResponseMessage.CHARGE_ALREADY_EXISTS_ERROR} (${chargeData.containerSize}, ${chargeData.containerType})`, HttpStatus_1.HttpStatus.CONFLICT);
        }
        const savedCharge = await this.chargeRepository.save(chargeData);
        return ChargeMapper_1.ChargeMapper.toResponseDto(savedCharge);
    }
}
exports.CreateCharge = CreateCharge;
//# sourceMappingURL=CreateCharge.js.map