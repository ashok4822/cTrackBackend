import { ContainerRequest } from "../../domain/entities/ContainerRequest";
import {
  IContainerRequestRepository,
  ContainerRequestFilter,
} from "../../domain/repositories/IContainerRequestRepository";
import {
  ContainerRequestModel,
  IContainerRequestDocument,
} from "../models/ContainerRequestModel";
import mongoose, { UpdateQuery } from "mongoose";

interface IContainerRequestAggregate extends Omit<
  Partial<IContainerRequestDocument>,
  "_id"
> {
  _id: mongoose.Types.ObjectId | string;
  customerId: string;
  type: "stuffing" | "destuffing";
  status: string;
  cargoCategoryName?: string;
  customerName?: string;
}

export class ContainerRequestRepository implements IContainerRequestRepository {
  private mapToEntity(
    doc: IContainerRequestDocument | IContainerRequestAggregate,
  ): ContainerRequest {
    const d = doc as IContainerRequestAggregate;
    return new ContainerRequest(
      d._id.toString(),
      d.customerId,
      d.type,
      d.status as ContainerRequest["status"],
      d.cargoCategoryId?.toString(),
      d.cargoCategoryName,
      d.containerSize,
      d.containerType,
      d.cargoDescription,
      d.cargoWeight,
      d.preferredDate,
      d.specialInstructions,
      d.isHazardous,
      d.hazardClass,
      d.unNumber,
      d.packingGroup,
      d.containerId?.toString(),
      d.containerNumber,
      d.remarks,
      d.checkpoints,
      d.cargoCharge,
      d.createdAt,
      d.updatedAt,
    );
  }

  async create(request: ContainerRequest): Promise<ContainerRequest> {
    const created = await ContainerRequestModel.create({
      customerId: request.customerId,
      type: request.type,
      status: request.status,
      cargoCategoryId: request.cargoCategoryId
        ? new mongoose.Types.ObjectId(request.cargoCategoryId)
        : undefined,
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
      containerId: request.containerId
        ? new mongoose.Types.ObjectId(request.containerId)
        : undefined,
      containerNumber: request.containerNumber,
      remarks: request.remarks,
      checkpoints: request.checkpoints,
      cargoCharge: request.cargoCharge,
    });
    return this.mapToEntity(created);
  }

  async findByCustomerId(customerId: string): Promise<ContainerRequest[]> {
    const pipeline: mongoose.PipelineStage[] = [
      { $match: { customerId } },
      // Join container details (for destuffing cargo info)
      {
        $lookup: {
          from: "containers",
          localField: "containerId",
          foreignField: "_id",
          as: "containerDetails",
        },
      },
      {
        $unwind: {
          path: "$containerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Resolve cargo fields: prefer request's own values, fall back to container
      {
        $addFields: {
          cargoDescription: {
            $cond: [
              {
                $gt: [{ $strLenCP: { $ifNull: ["$cargoDescription", ""] } }, 0],
              },
              "$cargoDescription",
              { $ifNull: ["$containerDetails.cargoDescription", null] },
            ],
          },
          cargoWeight: {
            $cond: [
              { $gt: [{ $ifNull: ["$cargoWeight", 0] }, 0] },
              "$cargoWeight",
              { $ifNull: ["$containerDetails.cargoWeight", null] },
            ],
          },
          isHazardous: {
            $cond: [
              { $ifNull: ["$isHazardous", false] },
              "$isHazardous",
              { $ifNull: ["$containerDetails.hazardousClassification", false] },
            ],
          },
          cargoCharge: { $ifNull: ["$cargoCharge", 0] },
        },
      },
      {
        $addFields: {
          id: "$_id",
        },
      },
      {
        $lookup: {
          from: "cargocategories",
          localField: "cargoCategoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          cargoCategoryName: {
            $ifNull: [
              "$categoryDetails.name",
              "$containerDetails.cargoCategory",
            ],
          },
        },
      },
      {
        $project: { containerDetails: 0, categoryDetails: 0 },
      },
      { $sort: { createdAt: -1 as const } },
    ];

    const results = await ContainerRequestModel.aggregate(pipeline);
    return results.map((doc) => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<ContainerRequest | null> {
    const doc = await ContainerRequestModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<ContainerRequest[]> {
    const pipeline: mongoose.PipelineStage[] = [
      // --- Join user (customer) details ---
      {
        $addFields: {
          customerIdObjectId: {
            $convert: {
              input: "$customerId",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customerIdObjectId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: {
          path: "$customerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // --- Join container details (for destuffing) ---
      {
        $lookup: {
          from: "containers",
          localField: "containerId",
          foreignField: "_id",
          as: "containerDetails",
        },
      },
      {
        $unwind: {
          path: "$containerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // --- Build display fields ---
      {
        $addFields: {
          // Customer name: companyName > name > customerId
          customerName: {
            $cond: [
              {
                $gt: [
                  {
                    $strLenCP: {
                      $ifNull: ["$customerDetails.companyName", ""],
                    },
                  },
                  0,
                ],
              },
              "$customerDetails.companyName",
              {
                $cond: [
                  {
                    $gt: [
                      { $strLenCP: { $ifNull: ["$customerDetails.name", ""] } },
                      0,
                    ],
                  },
                  "$customerDetails.name",
                  "$customerId",
                ],
              },
            ],
          },
          id: "$_id",
          // For destuffing: use cargo details from the linked container
          // if the request itself doesn't have them
          cargoDescription: {
            $cond: [
              {
                $gt: [{ $strLenCP: { $ifNull: ["$cargoDescription", ""] } }, 0],
              },
              "$cargoDescription",
              { $ifNull: ["$containerDetails.cargoDescription", null] },
            ],
          },
          cargoWeight: {
            $cond: [
              { $gt: [{ $ifNull: ["$cargoWeight", 0] }, 0] },
              "$cargoWeight",
              { $ifNull: ["$containerDetails.cargoWeight", null] },
            ],
          },
          isHazardous: {
            $cond: [
              { $ifNull: ["$isHazardous", false] },
              "$isHazardous",
              { $ifNull: ["$containerDetails.hazardousClassification", false] },
            ],
          },
          cargoCharge: { $ifNull: ["$cargoCharge", 0] },
        },
      },
      // --- Join cargo category ---
      {
        $lookup: {
          from: "cargocategories",
          localField: "cargoCategoryId",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          cargoCategoryName: {
            $ifNull: [
              "$categoryDetails.name",
              "$containerDetails.cargoCategory",
            ],
          },
        },
      },
      {
        $project: {
          customerDetails: 0,
          customerIdObjectId: 0,
          containerDetails: 0,
          categoryDetails: 0,
        },
      },
      {
        $sort: { createdAt: -1 as const },
      },
    ];

    const results = await ContainerRequestModel.aggregate(pipeline);
    return results.map((doc) => this.mapToEntity(doc));
  }

  async update(
    id: string,
    data: Partial<ContainerRequest>,
  ): Promise<ContainerRequest | null> {
    // Prepare update object handling undefined carefully
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...rest } = data;
    const updateData: UpdateQuery<IContainerRequestDocument> = { ...rest };

    if (data.containerId) {
      updateData.containerId = new mongoose.Types.ObjectId(data.containerId);
    }

    const updated = await ContainerRequestModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    return updated ? this.mapToEntity(updated) : null;
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<ContainerRequest | null> {
    const updated = await ContainerRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return updated ? this.mapToEntity(updated) : null;
  }

  async findByContainerNumber(
    containerNumber: string,
  ): Promise<ContainerRequest | null> {
    const doc = await ContainerRequestModel.findOne({
      containerNumber,
      status: { $in: ["ready-for-dispatch", "approved"] },
    }).sort({ createdAt: -1 });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findActiveRequestsByCustomerId(
    customerId: string,
  ): Promise<ContainerRequest[]> {
    const activeStatuses = [
      "pending",
      "approved",
      "ready-for-dispatch",
      "in-transit",
      "at-factory",
      "operation-completed",
    ];
    const docs = await ContainerRequestModel.find({
      customerId,
      status: { $in: activeStatuses },
    });
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async countPending(filter: ContainerRequestFilter): Promise<number> {
    return await ContainerRequestModel.countDocuments({
      ...filter,
      status: "pending",
    } as Record<string, unknown>);
  }

  async findRecent(
    filter: ContainerRequestFilter,
    limit: number,
  ): Promise<ContainerRequest[]> {
    // Find documents with the given filter
    const queryFilter = filter as Record<string, unknown>;
    const docs = await ContainerRequestModel.find(queryFilter)
      .sort({ createdAt: -1 as const }) // explicitly type the -1 to satisfy TS if needed
      .limit(limit);
    return docs.map((doc) => this.mapToEntity(doc));
  }
}
