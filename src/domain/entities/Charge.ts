export interface Charge {
    id?: string;
    activityId: string;
    activityName?: string;
    containerSize: "20ft" | "40ft" | "all";
    containerType: "standard" | "reefer" | "tank" | "all";
    rate: number;
    currency: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
    active: boolean;
}
