"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillRepository = void 0;
const Bill_1 = require("../../domain/entities/Bill");
const BillModel_1 = require("../models/BillModel");
const UserModel_1 = require("../models/UserModel");
const mongoose_1 = __importDefault(require("mongoose"));
class BillRepository {
    async findAll(customerId, status) {
        const query = {};
        if (customerId)
            query.customer = customerId;
        if (status)
            query.status = status;
        const docs = await BillModel_1.BillModel.find(query).sort({ createdAt: -1 }).lean();
        return this._mapWithCustomers(docs);
    }
    async findById(id) {
        const doc = await BillModel_1.BillModel.findById(id).lean();
        if (!doc)
            return null;
        const [mapped] = await this._mapWithCustomers([doc]);
        return mapped;
    }
    async findByContainerId(containerId) {
        const docs = await BillModel_1.BillModel.find({ containerId })
            .sort({ createdAt: -1 })
            .lean();
        return this._mapWithCustomers(docs);
    }
    async save(bill) {
        let leanDoc;
        if (bill.id && mongoose_1.default.Types.ObjectId.isValid(bill.id)) {
            const updated = await BillModel_1.BillModel.findByIdAndUpdate(bill.id, {
                billNumber: bill.billNumber,
                containerNumber: bill.containerNumber,
                containerId: bill.containerId,
                shippingLine: bill.shippingLine,
                customer: bill.customer,
                lineItems: bill.lineItems,
                totalAmount: bill.totalAmount,
                status: bill.status,
                dueDate: bill.dueDate,
                remarks: bill.remarks,
                paidAt: bill.paidAt,
                paymentMethod: bill.paymentMethod,
            }, { new: true, upsert: true }).lean();
            leanDoc = updated;
        }
        else {
            const created = new BillModel_1.BillModel({
                billNumber: bill.billNumber,
                containerNumber: bill.containerNumber,
                containerId: bill.containerId,
                shippingLine: bill.shippingLine,
                customer: bill.customer,
                lineItems: bill.lineItems,
                totalAmount: bill.totalAmount,
                status: bill.status,
                dueDate: bill.dueDate,
                remarks: bill.remarks,
                paidAt: bill.paidAt,
                paymentMethod: bill.paymentMethod,
            });
            await created.save();
            leanDoc = created.toObject();
        }
        const [mapped] = await this._mapWithCustomers([leanDoc]);
        return mapped;
    }
    async update(id, data) {
        const doc = await BillModel_1.BillModel.findByIdAndUpdate(id, data, {
            new: true,
        }).lean();
        if (!doc)
            return null;
        const [mapped] = await this._mapWithCustomers([doc]);
        return mapped;
    }
    // Helper to fetch user company names in bulk
    async _mapWithCustomers(docs) {
        if (!docs.length)
            return [];
        // Collect unique customer IDs
        const customerIds = [
            ...new Set(docs.map((d) => d.customer).filter((c) => Boolean(c))),
        ];
        // Fetch users - only for valid ObjectIds if the field expects it
        let userMap = {};
        if (customerIds.length > 0) {
            // Filter valid ObjectIds to prevent casting errors
            const validObjectIds = customerIds.filter((id) => mongoose_1.default.Types.ObjectId.isValid(id));
            if (validObjectIds.length > 0) {
                const users = await UserModel_1.UserModel.find({ _id: { $in: validObjectIds } })
                    .select("_id companyName name")
                    .lean();
                userMap = users.reduce((acc, u) => {
                    acc[u._id.toString()] =
                        u.companyName || u.name || "Unknown Company";
                    return acc;
                }, {});
            }
        }
        return docs.map((doc) => this._mapToEntity(doc, userMap));
    }
    _mapToEntity(doc, userMap = {}) {
        const { _id, ...rest } = doc;
        return new Bill_1.Bill(_id.toString(), rest.billNumber ?? "", rest.containerNumber ?? "", rest.shippingLine ?? "", rest.containerId?.toString(), rest.customer ?? null, rest.customer ? userMap[rest.customer] : undefined, rest.lineItems ?? [], rest.totalAmount, rest.status, rest.dueDate, rest.remarks, rest.paidAt, rest.paymentMethod, rest.createdAt, rest.updatedAt);
    }
    _applyAggregateFilters(filters) {
        const query = {};
        if (filters.customerId || filters.customerName) {
            const condition = [];
            if (filters.customerId) {
                condition.push({ customer: Array.isArray(filters.customerId) ? { $in: filters.customerId } : filters.customerId });
            }
            if (filters.customerName) {
                condition.push({ customerName: Array.isArray(filters.customerName) ? { $in: filters.customerName } : filters.customerName });
            }
            if (condition.length > 1) {
                query.$or = condition;
            }
            else if (condition.length === 1) {
                Object.assign(query, condition[0]);
            }
        }
        if (filters.status) {
            query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
        }
        if (filters.excludeStatus) {
            query.status = { $nin: Array.isArray(filters.excludeStatus) ? filters.excludeStatus : [filters.excludeStatus] };
        }
        return query;
    }
    async aggregateUnpaidAmount(filter) {
        const query = this._applyAggregateFilters(filter);
        const results = await BillModel_1.BillModel.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]).exec();
        return results.map(r => ({ total: r.total || 0 }));
    }
    async hasOverdueBills(customerId) {
        const doc = await BillModel_1.BillModel.findOne({ customer: customerId, status: "overdue" }).lean();
        return doc !== null;
    }
}
exports.BillRepository = BillRepository;
//# sourceMappingURL=BillRepository.js.map