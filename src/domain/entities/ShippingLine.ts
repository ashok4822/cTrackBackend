export class ShippingLine {
    constructor(
        public readonly id: string | null,
        public readonly shipping_line_name: string,
        public readonly shipping_line_code: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
