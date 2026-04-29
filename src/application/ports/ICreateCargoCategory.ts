import { CreateCargoCategoryRequestDto, CargoCategoryResponseDto } from "../dto/CargoDto";

export interface ICreateCargoCategory {
  execute(data: CreateCargoCategoryRequestDto): Promise<CargoCategoryResponseDto>;
}
