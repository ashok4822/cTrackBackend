import { UpdateActivityRequestDto, ActivityResponseDto } from "../dto/ActivityDto";

export interface IUpdateActivity {
    execute(id: string, activityData: UpdateActivityRequestDto): Promise<ActivityResponseDto | null>;
}
