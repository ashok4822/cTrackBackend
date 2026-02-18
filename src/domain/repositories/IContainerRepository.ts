import { Container } from "../entities/Container";

export interface IContainerRepository {
    findAll(filters?: {
        containerNumber?: string;
        size?: string;
        type?: string;
        block?: string;
        status?: string;
    }): Promise<Container[]>;
    findById(id: string): Promise<Container | null>;
    save(container: Container): Promise<Container>;
}
