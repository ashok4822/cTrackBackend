import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { Activity } from "../../domain/entities/Activity";

export class CreateActivity {
    constructor(private activityRepository: IActivityRepository) { }

    async execute(activityData: Activity): Promise<Activity> {
        const existing = await this.activityRepository.findByCode(activityData.code);
        if (existing) {
            throw new Error("Activity with this code already exists");
        }
        return this.activityRepository.save(activityData);
    }
}
