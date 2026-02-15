import { ShippingLine } from "../entities/ShippingLine";

export interface IShippingLineRepository {
    findAll(): Promise<ShippingLine[]>;
    findById(id: string): Promise<ShippingLine | null>;
    save(shippingLine: ShippingLine): Promise<void>;
}
