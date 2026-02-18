export class Block {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly capacity: number,
        public readonly occupied: number,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
