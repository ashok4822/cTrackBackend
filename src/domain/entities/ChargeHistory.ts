export interface ChargeHistory {
    id?: string;
    chargeId: string;
    activityName: string;
    containerSize: string;
    containerType: string;
    oldRate: number;
    newRate: number;
    currency: string;
    changedAt: Date;
}
