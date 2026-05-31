import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { IUpdateActivity } from "../ports/IUpdateActivity";
import { UpdateActivityRequestDto, ActivityResponseDto } from "../dto/ActivityDto";
import { ActivityMapper } from "../mappers/ActivityMapper";

export class UpdateActivity implements IUpdateActivity {
    constructor(private readonly _activityRepository: IActivityRepository) { }

    async execute(id: string, activityData: UpdateActivityRequestDto): Promise<ActivityResponseDto | null> {
        const updated = await this._activityRepository.update(id, activityData);
        if (!updated) return null;
        return ActivityMapper.toResponseDto(updated);
    }
}
