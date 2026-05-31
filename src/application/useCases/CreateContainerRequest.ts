import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { INotificationService } from "../services/INotificationService";
import { ICreateContainerRequest } from "../ports/ICreateContainerRequest";
import { DomainEvents, IEventBus } from "../../domain/events/IEventBus";
import { CreateContainerRequestDto, ContainerRequestResponseDto } from "../dto/RequestDto";
import { UserContextDto } from "../dto/CommonDto";
import { RequestMapper } from "../mappers/RequestMapper";
import { AppError } from "../../domain/exceptions/AppError";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ResponseMessage } from "../../shared/constants/ResponseMessage";

export class CreateContainerRequest implements ICreateContainerRequest {
  constructor(
    private readonly _containerRequestRepository: IContainerRequestRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _notificationService: INotificationService,
    private readonly _eventBus: IEventBus,
  ) {}


  async execute(
    requestData: CreateContainerRequestDto,
    userContext?: UserContextDto,
  ): Promise<ContainerRequestResponseDto> {
    const customerId = requestData.customerId || userContext?.userId || "";
    
    // Validation: Prevent duplicate destuffing requests for the same container
    if (requestData.type === "destuffing" && requestData.containerId) {
      const activeRequests =
        await this._containerRequestRepository.findActiveRequestsByCustomerId(
          customerId
        );
      const hasExistingRequest = activeRequests.some(
        (r) =>
          r.type === "destuffing" && r.containerId === requestData.containerId,
      );

      if (hasExistingRequest) {
        throw new AppError(
          ResponseMessage.DUPLICATE_DESTUFF_REQUEST,
          HttpStatus.CONFLICT
        );
      }
    }

    const request = RequestMapper.toEntity(
      { ...requestData, preferredDate: requestData.preferredDate ? new Date(requestData.preferredDate) : undefined },
      customerId
    );

    const savedRequest = await this._containerRequestRepository.create(request);

    // Audit Log (Event-driven)
    if (userContext) {
      this._eventBus.emit(DomainEvents.AUDIT_LOG_CREATED, {
        userId: userContext.userId,
        userRole: userContext.userRole,
        userName: userContext.userName,
        action: ResponseMessage.AUDIT_REQUEST_CREATED,
        resourceType: ResponseMessage.RESOURCE_REQUEST,
        resourceId: savedRequest.id,
        details: {
          type: savedRequest.type,
          containerNumber: savedRequest.containerNumber,
        },
        ipAddress: userContext.ipAddress,
      });
    }

    // Notify Operators
    try {
      const operators = await this._userRepository.findByRole("operator");
      const notificationData = {
        type: "info" as const,
        title: ResponseMessage.NEW_CONTAINER_REQUEST_TITLE,
        message: `${ResponseMessage.NEW_CONTAINER_REQUEST_MESSAGE} (Type: ${requestData.type})`,
        link: "/operator/cargo-requests",
      };

      for (const operator of operators) {
        if (operator.id) {
          await this._notificationService.send(operator.id, notificationData);
        }
      }
    } catch (error) {
      console.error("Failed to send operator notifications:", error);
    }

    return RequestMapper.toResponseDto(savedRequest);
  }
}
