import { CreateActivityRequestDto, ActivityResponseDto } from "../dto/ActivityDto";

export interface ICreateActivity {
  execute(activityData: CreateActivityRequestDto): Promise<ActivityResponseDto>;
}
