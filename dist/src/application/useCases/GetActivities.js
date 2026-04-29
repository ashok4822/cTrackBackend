"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActivities = void 0;
const ActivityMapper_1 = require("../mappers/ActivityMapper");
class GetActivities {
    activityRepository;
    constructor(activityRepository) {
        this.activityRepository = activityRepository;
    }
    async execute() {
        const activities = await this.activityRepository.findAll();
        return ActivityMapper_1.ActivityMapper.toCollectionResponseDto(activities);
    }
}
exports.GetActivities = GetActivities;
//# sourceMappingURL=GetActivities.js.map