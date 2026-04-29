export interface IAIChatContextBuilder {
    buildContainerContext(customerId: string): Promise<string>;
    buildBillContext(customerId: string): Promise<string>;
    buildPDAContext(userId: string): Promise<string>;
    buildGeneralContext(customerId: string, userId: string): Promise<string>;
}
