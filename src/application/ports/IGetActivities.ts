import { ActivityCollectionResponseDto } from "../dto/ActivityDto";

export interface IGetActivities {
  execute(): Promise<ActivityCollectionResponseDto>;
}
