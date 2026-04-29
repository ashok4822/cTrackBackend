import { Container } from "../../domain/entities/Container";
import { 
  CreateContainerRequestDto, 
  ContainerResponseDto, 
  ContainerCollectionResponseDto 
} from "../dto/ContainerDto";

export class ContainerMapper {
  static toEntity(dto: CreateContainerRequestDto): Container {
    return new Container(
      null,
      dto.containerNumber,
      dto.size,
      dto.type,
      dto.status,
      dto.shippingLine,
      undefined, // empty
      dto.movementType,
      dto.customer,
      undefined, // customerName
      undefined, // yardLocation
      undefined, // gateInTime
      undefined, // gateOutTime
      undefined, // dwellTime
      dto.weight,
      undefined, // cargoWeight
      undefined, // cargoDescription
      undefined, // hazardousClassification
      dto.sealNumber,
      undefined, // damaged
      undefined, // damageDetails
      undefined, // blacklisted
      undefined, // cargoCategory
      undefined, // createdAt
      undefined  // updatedAt
    );
  }

  static toResponseDto(container: Container): ContainerResponseDto {
    return {
      id: container.id,
      containerNumber: container.containerNumber,
      size: container.size,
      type: container.type,
      status: container.status,
      shippingLine: container.shippingLine,
      customer: container.customer,
      customerName: container.customerName,
      yardLocation: container.yardLocation,
      gateInTime: container.gateInTime,
      gateOutTime: container.gateOutTime,
      dwellTime: container.dwellTime,
      weight: container.weight,
      sealNumber: container.sealNumber,
      empty: container.empty,
      damaged: container.damaged,
      damageDetails: container.damageDetails,
      blacklisted: container.blacklisted,
      createdAt: container.createdAt,
      updatedAt: container.updatedAt,
    };
  }

  static toCollectionResponseDto(containers: Container[]): ContainerCollectionResponseDto {
    return {
      items: containers.map(c => this.toResponseDto(c)),
      total: containers.length,
    };
  }
}
