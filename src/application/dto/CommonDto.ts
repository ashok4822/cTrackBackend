export interface UserContextDto {
  userId: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  targetCustomerId?: string; // For admin acting on behalf of a customer
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface BaseFilterDto extends PaginationDto {
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
