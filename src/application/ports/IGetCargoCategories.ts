import { CargoCategoryCollectionResponseDto } from "../dto/CargoDto";

export interface IGetCargoCategories {
  execute(): Promise<CargoCategoryCollectionResponseDto>;
}
