import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '@admin/schema/admin.schema';
import { AdminController } from '@admin/admin.controller';
import { AdminService } from '@admin/admin.service';
import { AuthService } from '@auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  controllers: [AdminController],
  providers: [AdminService, AuthService, ConfigService, JwtService],
  exports: [MongooseModule],
})
export class AdminModule {}
