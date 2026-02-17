export class ContainerHistory {
    constructor(
        public readonly id: string | null,
        public readonly containerId: string,
        public readonly activity: string,
        public readonly details?: string,
        public readonly performedBy?: string,
        public readonly timestamp?: Date,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
