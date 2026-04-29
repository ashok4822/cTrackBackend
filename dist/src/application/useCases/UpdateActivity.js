"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActivity = void 0;
const ActivityMapper_1 = require("../mappers/ActivityMapper");
class UpdateActivity {
    _activityRepository;
    constructor(_activityRepository) {
        this._activityRepository = _activityRepository;
    }
    async execute(id, activityData) {
        const updated = await this._activityRepository.update(id, activityData);
        if (!updated)
            return null;
        return ActivityMapper_1.ActivityMapper.toResponseDto(updated);
    }
}
exports.UpdateActivity = UpdateActivity;
//# sourceMappingURL=UpdateActivity.js.map