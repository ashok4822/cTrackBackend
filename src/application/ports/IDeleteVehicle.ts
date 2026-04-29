export interface IDeleteVehicle {
    execute(id: string): Promise<void>;
}
