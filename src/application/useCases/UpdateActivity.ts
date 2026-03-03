import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { Activity } from "../../domain/entities/Activity";

export class UpdateActivity {
    constructor(private activityRepository: IActivityRepository) { }

    async execute(id: string, activityData: Partial<Activity>): Promise<Activity | null> {
        return this.activityRepository.update(id, activityData);
    }
}
