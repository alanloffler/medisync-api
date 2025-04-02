import { Professional } from '@professionals/schema/professional.schema';

export interface IProfessionalsData {
  count: number;
  data: Professional[];
  total: number;
}
