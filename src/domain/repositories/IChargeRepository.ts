import { Charge } from "../entities/Charge";

export interface IChargeRepository {
    findAll(): Promise<Charge[]>;
    findById(id: string): Promise<Charge | null>;
    findByActivityId(activityId: string): Promise<Charge[]>;
    findByCriteria(activityId: string, containerSize: string, containerType: string): Promise<Charge | null>;
    save(charge: Charge): Promise<Charge>;
    update(id: string, charge: Partial<Charge>): Promise<Charge | null>;
}
