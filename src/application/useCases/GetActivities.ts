import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { IGetActivities } from "../ports/IGetActivities";
import { ActivityCollectionResponseDto } from "../dto/ActivityDto";
import { ActivityMapper } from "../mappers/ActivityMapper";

export class GetActivities implements IGetActivities {
    constructor(private activityRepository: IActivityRepository) { }

    async execute(): Promise<ActivityCollectionResponseDto> {
        const activities = await this.activityRepository.findAll();
        return ActivityMapper.toCollectionResponseDto(activities);
    }
}
