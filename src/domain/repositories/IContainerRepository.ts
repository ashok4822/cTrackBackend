import { Container } from "../entities/Container";

export type ContainerFilter = {
    containerNumber?: string | string[];
    size?: string | string[];
    type?: string | string[];
    block?: string | string[];
    status?: string | string[];
    customer?: string | string[];
    empty?: boolean;
    isHazardous?: boolean;
    damaged?: boolean;
    blacklisted?: boolean;
};

export interface IContainerRepository {
    findAll(filters?: ContainerFilter): Promise<Container[]>;
    findById(id: string): Promise<Container | null>;
    save(container: Container): Promise<Container>;
    countByStatus(status: string | string[], filter?: ContainerFilter): Promise<number>;
    countByBlockNameAndStatuses(blockName: string, statuses: string[]): Promise<number>;
    findInYard(filter?: ContainerFilter): Promise<Container[]>;
    getDistinctContainerNumbers(filter?: ContainerFilter): Promise<string[]>;
    getDistinctContainerIds(filter?: ContainerFilter): Promise<string[]>;
    findRecent(filter: ContainerFilter, limit: number): Promise<Container[]>;
}
