export interface IBlockDomainService {
  decrementOccupancy(blockName: string): Promise<void>;
  incrementOccupancy(blockName: string): Promise<void>;
  updateOccupancy(blockName: string, count: number): Promise<void>;
}
