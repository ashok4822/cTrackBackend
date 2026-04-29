"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Container_1 = require("../../domain/entities/Container");
const ContainerModel_1 = require("../models/ContainerModel");
const BaseRepository_1 = require("./base/BaseRepository");
const UserModel_1 = require("../models/UserModel");
class ContainerRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(ContainerModel_1.ContainerModel);
    }
    applyFilters(filters) {
        const query = {};
        if (filters.containerNumber) {
            if (Array.isArray(filters.containerNumber)) {
                query.containerNumber = { $in: filters.containerNumber };
            }
            else {
                query.containerNumber = { $regex: `^${filters.containerNumber}$`, $options: "i" };
            }
        }
        if (filters.size) {
            query.size = Array.isArray(filters.size) ? { $in: filters.size } : filters.size;
        }
        if (filters.type) {
            const types = Array.isArray(filters.type) ? filters.type : [filters.type];
            query.type = { $in: types.map(t => t.toLowerCase()) };
        }
        if (filters.block) {
            query["yardLocation.block"] = Array.isArray(filters.block) ? { $in: filters.block } : filters.block;
        }
        if (filters.status) {
            query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
        }
        if (filters.customer) {
            query.customer = Array.isArray(filters.customer) ? { $in: filters.customer } : filters.customer;
        }
        if (filters.empty !== undefined) {
            query.empty = filters.empty;
        }
        if (filters.isHazardous !== undefined) {
            query.hazardousClassification = filters.isHazardous;
        }
        if (filters.damaged !== undefined) {
            query.damaged = filters.damaged;
        }
        if (filters.blacklisted !== undefined) {
            query.blacklisted = filters.blacklisted;
        }
        return query;
    }
    async findById(id) {
        const doc = await this.model.findById(id).exec();
        if (!doc)
            return null;
        const [container] = await this.mapWithCustomers([doc]);
        return container;
    }
    async findAll(filters) {
        const query = filters ? this.applyFilters(filters) : {};
        const containers = await this.model.find(query).exec();
        return this.mapWithCustomers(containers);
    }
    async mapWithCustomers(docs) {
        if (docs.length === 0)
            return [];
        const customerIds = [...new Set(docs.map(d => d.customer).filter(Boolean))];
        let userMap = {};
        if (customerIds.length > 0) {
            const validObjectIds = customerIds.filter(id => mongoose_1.default.Types.ObjectId.isValid(id));
            if (validObjectIds.length > 0) {
                const users = await UserModel_1.UserModel.find({ _id: { $in: validObjectIds } }).select('_id companyName name').lean();
                userMap = users.reduce((acc, u) => {
                    acc[u._id.toString()] = u.companyName || u.name || "Unknown Customer";
                    return acc;
                }, {});
            }
        }
        return docs.map(doc => this.toEntity(doc, userMap[doc.customer || ""]));
    }
    toEntity(c, customerName) {
        let dwellTime = c.dwellTime;
        if (c.gateInTime) {
            const outTime = c.gateOutTime ? new Date(c.gateOutTime) : new Date();
            const inTime = new Date(c.gateInTime);
            const diffMs = outTime.getTime() - inTime.getTime();
            dwellTime = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }
        return new Container_1.Container(c._id.toString(), c.containerNumber, c.size, c.type, c.status, c.shippingLine, c.empty, c.movementType, c.customer, customerName || c.customer, // Use ID as fallback if name not found
        c.yardLocation, c.gateInTime, c.gateOutTime, dwellTime, c.weight, c.cargoWeight, c.cargoDescription, c.hazardousClassification, c.sealNumber, c.damaged, c.damageDetails, c.blacklisted, c.cargoCategory, c.createdAt, c.updatedAt);
    }
    toModelData(container) {
        const data = {
            containerNumber: container.containerNumber,
            size: container.size,
            type: container.type,
            movementType: container.movementType,
            status: container.status,
            shippingLine: container.shippingLine,
            customer: container.customer,
            gateInTime: container.gateInTime,
            gateOutTime: container.gateOutTime,
            dwellTime: container.dwellTime,
            weight: container.weight,
            cargoWeight: container.cargoWeight,
            cargoDescription: container.cargoDescription,
            hazardousClassification: container.hazardousClassification,
            sealNumber: container.sealNumber,
            damaged: container.damaged,
            damageDetails: container.damageDetails,
            blacklisted: container.blacklisted,
            empty: container.empty,
            cargoCategory: container.cargoCategory,
        };
        if (container.yardLocation) {
            data.yardLocation = container.yardLocation;
        }
        else {
            data.$unset = { yardLocation: "" };
        }
        return data;
    }
    async countByStatus(status, filter) {
        const query = filter ? this.applyFilters(filter) : {};
        if (Array.isArray(status)) {
            query.status = { $in: status };
        }
        else {
            query.status = status;
        }
        return await this.model.countDocuments(query).exec();
    }
    async countByBlockNameAndStatuses(blockName, statuses) {
        return await this.model.countDocuments({
            'yardLocation.block': blockName,
            status: { $in: statuses },
        }).exec();
    }
    async findInYard(filter) {
        const query = filter ? this.applyFilters(filter) : {};
        query.status = { $in: ["gate-in", "in-yard", "damaged"] };
        query.gateInTime = { $exists: true };
        const docs = await this.model.find(query).exec();
        return this.mapWithCustomers(docs);
    }
    async getDistinctContainerNumbers(filter) {
        const query = filter ? this.applyFilters(filter) : {};
        return await this.model.find(query).distinct("containerNumber").exec();
    }
    async getDistinctContainerIds(filter) {
        const query = filter ? this.applyFilters(filter) : {};
        return (await this.model.find(query).distinct("_id").exec()).map(id => id.toString());
    }
    async findRecent(filter, limit) {
        const query = this.applyFilters(filter);
        const docs = await this.model.find(query).sort({ updatedAt: -1 }).limit(limit).exec();
        return this.mapWithCustomers(docs);
    }
}
exports.ContainerRepository = ContainerRepository;
//# sourceMappingURL=ContainerRepository.js.map