export class PDA {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly customer: string, // fallback to name
        public readonly balance: number = 0,
        public readonly lastUpdated: Date = new Date()
    ) { }
}

export class PDATransaction {
    constructor(
        public readonly id: string,
        public readonly pdaId: string,
        public readonly type: "credit" | "debit",
        public readonly amount: number,
        public readonly description: string,
        public readonly balanceAfter: number,
        public readonly timestamp: Date = new Date()
    ) { }
}
