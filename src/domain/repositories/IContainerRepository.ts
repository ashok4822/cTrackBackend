import { Container } from "../entities/Container";

export type ContainerFilter = {
    containerNumber?: string;
    size?: string;
    type?: string;
    block?: string;
    status?: string | string[] | { $in: string[] };
    customer?: string;
    empty?: boolean;
    [key: string]: unknown;
};

export interface IContainerRepository {
    findAll(filters?: ContainerFilter): Promise<Container[]>;
    findById(id: string): Promise<Container | null>;
    save(container: Container): Promise<Container>;
    countByStatus(status: string | string[], filter?: ContainerFilter): Promise<number>;
    findInYard(filter?: ContainerFilter): Promise<Container[]>;
    getDistinctContainerNumbers(filter?: ContainerFilter): Promise<string[]>;
    getDistinctContainerIds(filter?: ContainerFilter): Promise<string[]>;
    findRecent(filter: ContainerFilter, limit: number): Promise<Container[]>;
}
