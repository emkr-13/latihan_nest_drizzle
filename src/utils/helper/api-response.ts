export class ApiResponse {
  constructor(
    public success: boolean,
    public message: string,
    public data?: any,
    public errors?: any,
  ) {}

  static success(message: string, data?: any): ApiResponse {
    return new ApiResponse(true, message, data);
  }

  static error(message: string, errors?: any): ApiResponse {
    return new ApiResponse(false, message, undefined, errors);
  }
}
