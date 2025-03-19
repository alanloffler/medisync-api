import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERole } from '@common/enums/role.enum';
import { ROLES_KEY } from '@common/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: ERole[] = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles || roles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    const roleExists = roles.some((role) => user.role?.includes(role));

    if (!roleExists) {
      throw new HttpException('Unauthorized - Credentials are not valid for role needed', HttpStatus.UNAUTHORIZED);
    } else {
      return true;
    }
  }
}
