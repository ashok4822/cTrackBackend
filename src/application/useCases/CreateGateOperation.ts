import { IGateOperationRepository } from "../../domain/repositories/IGateOperationRepository";
import { IVehicleRepository } from "../../domain/repositories/IVehicleRepository";
import { IContainerRepository } from "../../domain/repositories/IContainerRepository";
import { IContainerHistoryRepository } from "../../domain/repositories/IContainerHistoryRepository";
import { IContainerRequestRepository } from "../../domain/repositories/IContainerRequestRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IBillRepository } from "../../domain/repositories/IBillRepository";
import { GateOperation } from "../../domain/entities/GateOperation";
import { ContainerHistory } from "../../domain/entities/ContainerHistory";
import { Container } from "../../domain/entities/Container";
import { Vehicle, VehicleType } from "../../domain/entities/Vehicle";

import { IBlockRepository } from "../../domain/repositories/IBlockRepository";
import { Block } from "../../domain/entities/Block";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { UserContext } from "./AdminCreateUser";

export class CreateGateOperation {
  constructor(
    private gateOperationRepository: IGateOperationRepository,
    private vehicleRepository: IVehicleRepository,
    private containerRepository: IContainerRepository,
    private historyRepository: IContainerHistoryRepository,
    private containerRequestRepository: IContainerRequestRepository,
    private userRepository: IUserRepository,
    private blockRepository: IBlockRepository,
    private auditLogRepository?: IAuditLogRepository,
    private billRepository?: IBillRepository,
  ) {}

  async execute(
    data: {
      type: "gate-in" | "gate-out";
      containerNumber?: string;
      vehicleNumber: string;
      driverName: string;
      purpose: "port" | "factory" | "transfer";
      remarks?: string;
      approvedBy?: string;
      // Extra vehicle fields
      driverPhone?: string;
      vehicleType?: string;
      // Additional container fields
      size?: "20ft" | "40ft";
      containerType?: "standard" | "reefer" | "tank" | "open-top";
      shippingLine?: string;
      weight?: number;
      cargoWeight?: number;
      cargoDescription?: string;
      hazardousClassification?: boolean;
      sealNumber?: string;
      empty?: boolean;
      movementType?: "import" | "export" | "domestic";
      customer?: string;
      cargoCategory?: string;
    },
    userContext?: UserContext,
    performedBy: string = "Operator",
  ): Promise<void> {
    // 1. Find Vehicle and Container first for validation
    const vehicles = await this.vehicleRepository.findAll({
      vehicleNumber: data.vehicleNumber,
    });
    const vehicle = vehicles.length > 0 ? vehicles[0] : null;

    let container: Container | null = null;
    if (data.containerNumber) {
      const containers = await this.containerRepository.findAll({
        containerNumber: data.containerNumber,
      });
      container = containers.length > 0 ? containers[0] : null;
    }

    // 2. Validate Vehicle Status
    if (data.type === "gate-in") {
      if (vehicle && vehicle.status === "in-yard") {
        throw new Error(`Vehicle ${data.vehicleNumber} is already in the yard`);
      }
    }

    // 3. Validate Container Status
    if (data.containerNumber) {
      if (container && container.blacklisted) {
        throw new Error(
          `Container ${data.containerNumber} is blacklisted and cannot perform gate operations`,
        );
      }

      if (data.type === "gate-in") {
        if (
          container &&
          container.status !== "gate-out" &&
          container.status !== "pending"
        ) {
          throw new Error(
            "Container is already inside terminal or in an invalid state",
          );
        }
      } else if (data.type === "gate-out") {
        // Check for pending bills before allowing gate-out
        if (container && container.id && this.billRepository) {
          const bills = await this.billRepository.findByContainerId(
            container.id,
          );
          const hasPendingBills = bills.some(
            (bill) => bill.status === "pending" || bill.status === "overdue",
          );

          if (hasPendingBills) {
            throw new Error(
              `Cannot gate-out container ${data.containerNumber} because it has pending/overdue bills.`,
            );
          }
        }
      }
    }

    // 4. Create and Save Gate Operation Record
    const operation = new GateOperation(
      null,
      data.type,
      data.containerNumber,
      data.vehicleNumber,
      data.driverName,
      data.purpose,
      new Date(),
      data.approvedBy,
      data.remarks,
      data.cargoCategory,
    );
    await this.gateOperationRepository.save(operation);

    // 5. Update Vehicle Status
    if (data.type === "gate-in") {
      const vehicleData = {
        vehicleNumber: data.vehicleNumber,
        driverName: data.driverName,
        driverPhone:
          data.driverPhone || (vehicle ? vehicle.driverPhone : "Unknown"),
        type:
          (data.vehicleType as VehicleType) ||
          (vehicle ? vehicle.type : "truck"),
        status: "in-yard" as const,
        currentLocation: "Yard Entrance",
      };

      const vType: VehicleType = vehicleData.type as VehicleType;
      const vStatus = vehicleData.status;

      if (vehicle) {
        // Update existing vehicle
        const vehicleEntity = new Vehicle(
          vehicle.id,
          vehicleData.vehicleNumber,
          vehicleData.driverName,
          vehicleData.driverPhone,
          vType,
          vStatus,
          vehicle.gpsDeviceId,
          vehicleData.currentLocation,
          vehicle.createdAt,
          new Date(),
        );
        await this.vehicleRepository.save(vehicleEntity);
      } else {
        // Create new vehicle
        const newVehicle = new Vehicle(
          undefined,
          vehicleData.vehicleNumber,
          vehicleData.driverName,
          vehicleData.driverPhone,
          vType,
          vStatus,
          undefined,
          vehicleData.currentLocation,
        );
        await this.vehicleRepository.save(newVehicle);
      }
    } else if (data.type === "gate-out" && vehicle) {
      const updatedVehicle = new Vehicle(
        vehicle.id,
        vehicle.vehicleNumber,
        vehicle.driverName,
        vehicle.driverPhone,
        vehicle.type,
        "out-of-yard",
        vehicle.gpsDeviceId,
        "Exited",
        vehicle.createdAt,
        new Date(),
      );
      await this.vehicleRepository.save(updatedVehicle);
    }

    if (data.containerNumber) {
      if (data.type === "gate-in") {
        let customerName = data.customer; // Default to ID if not found
        if (data.customer) {
          const customerUser = await this.userRepository.findById(
            data.customer,
          );
          if (customerUser) {
            customerName = customerUser.companyName || customerUser.name;
          }
        }

        if (!container) {
          // Create new container if it doesn't exist
          container = new Container(
            null,
            data.containerNumber,
            data.size || "40ft",
            data.containerType || "standard",
            "gate-in",
            data.shippingLine || "Unknown",
            data.empty ?? true,
            data.movementType || "import",
            data.customer,
            customerName,
            undefined, // yardLocation
            new Date(),
            undefined,
            undefined,
            data.weight,
            data.cargoWeight,
            data.cargoDescription,
            data.hazardousClassification,
            data.sealNumber,
            false, // damaged
            undefined,
            false, // blacklisted
            data.cargoCategory,
            new Date(),
            new Date(),
          );
        } else {
          // Update existing container status and other fields
          const updatedContainer = new Container(
            container.id,
            container.containerNumber,
            data.size || container.size,
            data.containerType || container.type,
            "gate-in",
            data.shippingLine || container.shippingLine,
            data.empty ?? container.empty,
            data.movementType || container.movementType,
            data.customer || container.customer,
            customerName || container.customerName,
            container.yardLocation,
            new Date(),
            undefined, // Clear old gate-out time
            undefined, // Clear old dwell time
            data.weight ?? container.weight,
            data.cargoWeight ?? container.cargoWeight,
            data.cargoDescription ?? container.cargoDescription,
            data.hazardousClassification ??
              container.hazardousClassification,
            data.sealNumber ?? container.sealNumber,
            container.damaged,
            container.damageDetails,
            container.blacklisted,
            data.cargoCategory || container.cargoCategory,
            container.createdAt,
            new Date(),
          );
          container = updatedContainer;
        }
      } else {
        // gate-out
        if (container) {
          // gate-out synchronization: Decrement block occupancy if container was in yard
          if (container.yardLocation?.block) {
            const block = await this.blockRepository.findByName(
              container.yardLocation.block,
            );
            if (block) {
              const updatedBlock = new Block(
                block.id,
                block.name,
                block.capacity,
                Math.max(0, block.occupied - 1),
                block.createdAt,
                new Date(),
              );
              await this.blockRepository.save(updatedBlock);
            }
          }

          const updatedContainer = new Container(
            container.id,
            container.containerNumber,
            container.size,
            container.type,
            "gate-out",
            container.shippingLine,
            container.empty,
            container.movementType,
            container.customer,
            container.customerName,
            undefined, // yardLocation cleared on gate-out
            container.gateInTime,
            new Date(),
            container.dwellTime,
            container.weight,
            container.cargoWeight,
            container.cargoDescription,
            container.hazardousClassification,
            container.sealNumber,
            container.damaged,
            container.damageDetails,
            container.blacklisted,
            container.cargoCategory,
            container.createdAt,
            new Date(),
          );
          container = updatedContainer;

          // Update corresponding ContainerRequest if active
          const activeRequest =
            await this.containerRequestRepository.findByContainerNumber(
              container.containerNumber,
            );
          if (
            activeRequest &&
            activeRequest.id &&
            (activeRequest.status === "ready-for-dispatch" ||
              activeRequest.status === "approved")
          ) {
            const existingCheckpoints = activeRequest.checkpoints || [];
            await this.containerRequestRepository.update(activeRequest.id, {
              status: "in-transit",
              checkpoints: [
                ...existingCheckpoints,
                {
                  location: "Terminal Gate",
                  status: "gate-out",
                  timestamp: new Date(),
                  remarks: "Container gated out from terminal.",
                },
              ],
            });
          }
        }
      }
    }

    if (container) {
      const savedContainer = await this.containerRepository.save(container);

      // 6. Record History
      if (savedContainer.id) {
        const history = new ContainerHistory(
          null,
          savedContainer.id,
          data.type === "gate-in" ? "Gate In" : "Gate Out",
          `Processed ${data.type} operation at gate. Vehicle: ${data.vehicleNumber}, Driver: ${data.driverName}`,
          performedBy,
        );
        await this.historyRepository.save(history);
      }

      // 7. Audit Log
      if (this.auditLogRepository && userContext) {
        await this.auditLogRepository.save(
          new AuditLog(
            null,
            userContext.userId,
            userContext.userRole,
            userContext.userName,
            data.type === "gate-in"
              ? "CONTAINER_GATE_IN"
              : "CONTAINER_GATE_OUT",
            "Container",
            savedContainer.id,
            JSON.stringify({
              containerNumber: savedContainer.containerNumber,
              type: data.type,
              vehicleNumber: data.vehicleNumber,
            }),
            userContext.ipAddress,
          ),
        );
      }
    }
  }
}
