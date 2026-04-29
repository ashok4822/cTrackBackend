export interface ContainerSummary {
    id: string;
    containerNumber: string;
}

export class ContainerHistory {
    constructor(
        public readonly id: string | null,
        public containerId: string | ContainerSummary,
        public readonly activity: string,
        public readonly details?: string,
        public readonly performedBy?: string,
        public readonly timestamp?: Date,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
