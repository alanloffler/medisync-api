import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Reflector } from '@nestjs/core';
import type { I18nTranslations } from '@i18n/i18n.generated';
import { ERole } from '@common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: ERole[] = this.reflector.getAllAndOverride<ERole[]>('roles', [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    const roleExists: boolean = requiredRoles.some((role) => user.role === role);

    if (!roleExists) {
      throw new HttpException(this.i18nService.t('exception.auth.forbidden'), HttpStatus.FORBIDDEN);
    } else {
      return true;
    }
  }
}
