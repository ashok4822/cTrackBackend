import { IActivityRepository } from "../../domain/repositories/IActivityRepository";
import { ICreateActivity } from "../ports/ICreateActivity";
import { CreateActivityRequestDto, ActivityResponseDto } from "../dto/ActivityDto";
import { ActivityMapper } from "../mappers/ActivityMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateActivity implements ICreateActivity {
    constructor(private activityRepository: IActivityRepository) { }

    async execute(activityData: CreateActivityRequestDto): Promise<ActivityResponseDto> {
        const existing = await this.activityRepository.findByCode(activityData.code);
        if (existing) {
            throw new AppError(ResponseMessage.ACTIVITY_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }
        const entity = ActivityMapper.toEntity(activityData);
        const saved = await this.activityRepository.save(entity);
        return ActivityMapper.toResponseDto(saved);
    }
}

