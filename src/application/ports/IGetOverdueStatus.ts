export interface IGetOverdueStatus {
    execute(customerId: string): Promise<boolean>;
}
