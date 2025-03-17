import type { ITokens } from '@auth/interface/tokens.interface';

export interface IResponse<T = any> {
  data?: T;
  message: string;
  pagination?: {
    hasMore: boolean;
    totalItems: number;
  };
  stats?: IStats;
  statusCode: number;
  // TODO: remove when implement http-only cookie
  tokens?: ITokens;
}

export interface IStats {
  attended: number;
  notAttended: number;
  notStatus: number;
  total: number;
  waiting: number;
}
