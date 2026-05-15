import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import { 
  CreateContainerRequestDto, 
  ContainerRequestResponseDto, 
  ContainerRequestCollectionResponseDto 
} from "../dto/RequestDto";

export class RequestMapper {
  static toEntity(dto: CreateContainerRequestDto, customerId: string): ContainerRequest {
    return new ContainerRequest(
      null,
      customerId,
      dto.type,
      "pending",
      dto.cargoCategoryId,
      dto.cargoCategoryName,
      dto.containerSize,
      dto.containerType,
      dto.cargoDescription,
      dto.cargoWeight,
      dto.preferredDate,
      dto.specialInstructions,
      dto.isHazardous,
      dto.hazardClass,
      dto.unNumber,
      dto.packingGroup,
      dto.containerId,
      dto.containerNumber,
      dto.remarks
    );
  }

  static toResponseDto(request: ContainerRequest): ContainerRequestResponseDto {
    return {
      id: request.id,
      customerId: request.customerId,
      customerName: request.customerName,
      type: request.type,
      status: request.status,
      cargoCategoryId: request.cargoCategoryId,
      cargoCategoryName: request.cargoCategoryName,
      containerSize: request.containerSize,
      containerType: request.containerType,
      cargoDescription: request.cargoDescription,
      cargoWeight: request.cargoWeight,
      preferredDate: request.preferredDate,
      specialInstructions: request.specialInstructions,
      isHazardous: request.isHazardous,
      hazardClass: request.hazardClass,
      unNumber: request.unNumber,
      packingGroup: request.packingGroup,
      containerId: request.containerId,
      containerNumber: request.containerNumber,
      remarks: request.remarks,
      checkpoints: request.checkpoints,
      cargoCharge: request.cargoCharge,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };
  }

  static toCollectionResponseDto(requests: ContainerRequest[]): ContainerRequestCollectionResponseDto {
    return {
      items: requests.map(req => this.toResponseDto(req)),
      total: requests.length,
    };
  }

  static updateCheckpoints(
    existing: { checkpoints?: Array<{ location: string; timestamp: Date; status: string; remarks?: string }>; status: string; containerNumber?: string }, 
    data: { status?: string; containerNumber?: string; checkpoints?: Array<{ location: string; timestamp: Date; status: string; remarks?: string }> }
  ): Array<{ location: string; timestamp: Date; status: string; remarks?: string }> {
    const currentCheckpoints = data.checkpoints
      ? [...data.checkpoints]
      : [...(existing.checkpoints || [])];
    

    if (data.status && data.status !== existing.status) {
      const alreadyLogged = currentCheckpoints.some(
        (cp) =>
          cp.status === data.status &&
          Math.abs(new Date(cp.timestamp).getTime() - new Date().getTime()) < 10000
      );

      if (!alreadyLogged) {
        currentCheckpoints.push({
          location: "Terminal Office",
          timestamp: new Date(),
          status: data.status,
          remarks: `Request status updated to ${data.status.replace(/-/g, " ")}`,
        });
      }
    }

    if (data.containerNumber && data.containerNumber !== existing.containerNumber) {
      const alreadyLogged = currentCheckpoints.some(
        (cp) =>
          cp.remarks?.includes(data.containerNumber!) &&
          Math.abs(new Date(cp.timestamp).getTime() - new Date().getTime()) < 10000
      );

      if (!alreadyLogged) {
        currentCheckpoints.push({
          location: "Yard Allocation",
          timestamp: new Date(),
          status: data.status || existing.status,
          remarks: `Container ${data.containerNumber} allotted to request`,
        });
      }
    }

    return currentCheckpoints;
  }
}
