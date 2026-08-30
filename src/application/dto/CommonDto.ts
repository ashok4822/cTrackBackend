export class UserContextDto {
  userId!: string;
  userName!: string;
  userRole!: string;
  ipAddress!: string;
  targetCustomerId?: string; // For admin acting on behalf of a customer
}

export class PaginationDto {
  page?: number;
  limit?: number;
}

export class BaseFilterDto extends PaginationDto {
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
