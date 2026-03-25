import { Bill } from "../entities/Bill";

export interface BillAggregateFilter {
    $or?: Array<Record<string, string>>;
    status?: { $ne: string };
    customer?: string;
}

export interface BillAggregateResult {
    _id: null;
    total: number;
}

export interface IBillRepository {
    findAll(customerId?: string): Promise<Bill[]>;
    findById(id: string): Promise<Bill | null>;
    findByContainerId(containerId: string): Promise<Bill[]>;
    save(bill: Bill): Promise<Bill>;
    update(id: string, data: Partial<Bill>): Promise<Bill | null>;
    aggregateUnpaidAmount(filter: BillAggregateFilter): Promise<BillAggregateResult[]>;
}
