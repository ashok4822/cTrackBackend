export class Activity {
    constructor(
        public id: string | null,
        public code: string,
        public name: string,
        public description: string,
        public category: "handling" | "storage" | "stuffing" | "transport" | "other",
        public unitType: "per-container" | "per-day" | "per-hour" | "per-teu" | "fixed",
        public active: boolean
    ) { }
}
