export interface Activity {
    id?: string;
    code: string;
    name: string;
    description: string;
    category: "handling" | "storage" | "stuffing" | "transport" | "other";
    unitType: "per-container" | "per-day" | "per-hour" | "per-teu" | "fixed";
    active: boolean;
}
