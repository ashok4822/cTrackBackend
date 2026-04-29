import { GateOperation } from "../../domain/entities/GateOperation";
import { 
  CreateGateOperationRequestDto, 
  GateOperationResponseDto, 
  GateOperationCollectionResponseDto 
} from "../dto/GateDto";

export class GateMapper {
  static toEntity(dto: CreateGateOperationRequestDto, approvedBy?: string): GateOperation {
    return new GateOperation(
      null,
      dto.type,
      dto.containerNumber,
      dto.vehicleNumber,
      dto.driverName,
      dto.purpose,
      new Date(),
      approvedBy,
      dto.remarks,
      dto.cargoCategory
    );
  }

  static toResponseDto(operation: GateOperation): GateOperationResponseDto {
    return {
      id: operation.id,
      type: operation.type,
      containerNumber: operation.containerNumber,
      vehicleNumber: operation.vehicleNumber,
      driverName: operation.driverName,
      purpose: operation.purpose,
      timestamp: operation.timestamp,
      approvedBy: operation.approvedBy,
      remarks: operation.remarks,
      cargoCategory: operation.cargoCategory,
    };
  }

  static toCollectionResponseDto(operations: GateOperation[]): GateOperationCollectionResponseDto {
    return {
      items: operations.map(op => this.toResponseDto(op)),
      total: operations.length,
    };
  }
}
