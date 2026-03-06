export class CargoCategory {
    constructor(
        public readonly id: string | null,
        public readonly name: string,
        public readonly description?: string,
        public readonly active: boolean = true,
        public readonly chargePerTon: number = 0
    ) { }
}
