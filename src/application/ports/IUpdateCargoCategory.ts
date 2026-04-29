import { UpdateCargoCategoryRequestDto, CargoCategoryResponseDto } from "../dto/CargoDto";

export interface IUpdateCargoCategory {
  execute(id: string, data: UpdateCargoCategoryRequestDto): Promise<CargoCategoryResponseDto | null>;
}
