import { User } from '@users/schema/user.schema';

export interface IUsersData {
  count: number;
  data: User[];
  total: number;
}
