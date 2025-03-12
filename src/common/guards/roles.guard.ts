import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERole } from '@common/enums/role.enum';
import { ROLES_KEY } from '@common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role: ERole = this.reflector.getAllAndOverride<ERole>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!role) return true;

    const { user } = context.switchToHttp().getRequest();
    if (user.role === ERole.Admin) return true;

    if (role === user.role) {
      return true;
    } else {
      throw new HttpException('Credentials are not valid', HttpStatus.FORBIDDEN);
    }
  }
}
