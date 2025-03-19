import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '@admin/admin.module';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { LocalStrategy } from '@auth/strategies/local.strategy';

@Module({
  imports: [AdminModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
