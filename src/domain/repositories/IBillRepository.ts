import { Bill } from "../entities/Bill";

export interface IBillRepository {
    findAll(customerId?: string): Promise<Bill[]>;
    findById(id: string): Promise<Bill | null>;
    findByContainerId(containerId: string): Promise<Bill[]>;
    save(bill: Bill): Promise<Bill>;
    update(id: string, data: Partial<Bill>): Promise<Bill | null>;
}
