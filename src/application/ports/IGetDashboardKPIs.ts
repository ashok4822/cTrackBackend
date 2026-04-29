import { DashboardKPIsResponseDto, GetDashboardKPIsRequestDto } from "../dto/DashboardDto";

export interface IGetDashboardKPIs {
  execute(request: GetDashboardKPIsRequestDto): Promise<DashboardKPIsResponseDto>;
}
