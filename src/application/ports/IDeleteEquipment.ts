export interface IDeleteEquipment {
    execute(id: string): Promise<void>;
}
