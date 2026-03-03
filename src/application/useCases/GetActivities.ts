import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { Activity } from "../../domain/entities/Activity";

export class GetActivities {
    constructor(private activityRepository: IActivityRepository) { }

    async execute(): Promise<Activity[]> {
        return this.activityRepository.findAll();
    }
}
