"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActivity = void 0;
const ActivityMapper_1 = require("../mappers/ActivityMapper");
const AppError_1 = require("../../domain/exceptions/AppError");
const HttpStatus_1 = require("../../shared/constants/HttpStatus");
const ResponseMessage_1 = require("../../shared/constants/ResponseMessage");
class CreateActivity {
    activityRepository;
    constructor(activityRepository) {
        this.activityRepository = activityRepository;
    }
    async execute(activityData) {
        const existing = await this.activityRepository.findByCode(activityData.code);
        if (existing) {
            throw new AppError_1.AppError(ResponseMessage_1.ResponseMessage.ACTIVITY_ALREADY_EXISTS, HttpStatus_1.HttpStatus.CONFLICT);
        }
        const entity = ActivityMapper_1.ActivityMapper.toEntity(activityData);
        const saved = await this.activityRepository.save(entity);
        return ActivityMapper_1.ActivityMapper.toResponseDto(saved);
    }
}
exports.CreateActivity = CreateActivity;
//# sourceMappingURL=CreateActivity.js.map