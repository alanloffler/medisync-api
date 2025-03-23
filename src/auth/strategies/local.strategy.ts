import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { IPayload } from '@auth/interface/payload.interface';
import { Admin } from '@admin/schema/admin.schema';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly i18nService: I18nService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  public async validate(email: string, password: string): Promise<IPayload> {
    const admin: Admin = await this.authService.validateAdmin(email, password);
    if (!admin) throw new HttpException(this.i18nService.t('exception.auth.login'), HttpStatus.UNAUTHORIZED);

    return {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
    };
  }
}
