export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export function toApiResponse<T>(data: T, statusCode = 200): ApiResponse<T> {
  return {
    data,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}
