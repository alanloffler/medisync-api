import type { IPayload } from '@auth/interface/payload.interface';

export interface IRequest extends Request {
  user: IPayload;
}
