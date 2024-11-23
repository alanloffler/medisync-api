export interface IResponse<T = any> {
  statusCode: number;
  message: string;
  data?: any;
  pagination?: {
    hasMore: boolean;
    totalItems: number;
  };
}
