import { SetMetadata, type CustomDecorator } from '@nestjs/common';
import { ERole } from '@common/enums/role.enum';

export const ROLES_KEY: string = 'roles';

export const Roles: (role: ERole) => CustomDecorator<string> = (role: ERole) => SetMetadata(ROLES_KEY, [role]);
