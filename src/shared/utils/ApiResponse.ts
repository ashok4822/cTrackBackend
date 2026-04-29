import { ResponseMessage } from "../constants/ResponseMessage";

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
  ) {}

  static success<T>(data: T, message: string = ResponseMessage.SUCCESS): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static error(message: string, data?: any): ApiResponse<null> {
    return new ApiResponse(false, message, data);
  }
}

