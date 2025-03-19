import type { IPayload } from '@auth/interface/payload.interface';
import type { Request } from 'express';

export interface IRequest extends Request {
  user: IPayload;
  cookies: {
    [key: string]: string;
    accessToken: string;
    refreshToken: string;
  };
}
