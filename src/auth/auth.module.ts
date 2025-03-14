import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AdminModule } from '@admin/admin.module';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';

@Module({
  imports: [AdminModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtService],
})
export class AuthModule {}
