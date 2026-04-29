export class Charge {
    constructor(
        public id: string | null,
        public activityId: string,
        public activityName: string | undefined,
        public containerSize: "20ft" | "40ft" | "all",
        public containerType: "standard" | "reefer" | "tank" | "all",
        public rate: number,
        public currency: string,
        public effectiveFrom: Date,
        public active: boolean,
        public cargoCategoryId?: string,
        public cargoCategoryName?: string,
        public effectiveTo?: Date
    ) { }
}
