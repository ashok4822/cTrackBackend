import { Activity } from "../entities/Activity";

export interface IActivityRepository {
    findAll(): Promise<Activity[]>;
    findById(id: string): Promise<Activity | null>;
    findByCode(code: string): Promise<Activity | null>;
    save(activity: Activity): Promise<Activity>;
    update(id: string, activity: Partial<Activity>): Promise<Activity | null>;
}
