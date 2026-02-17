import { Container } from "../entities/Container";

export interface IContainerRepository {
    findAll(): Promise<Container[]>;
    findById(id: string): Promise<Container | null>;
    save(container: Container): Promise<Container>;
}
