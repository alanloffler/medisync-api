import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from '@admin/admin.module';
import { AppointmentsModule } from '@appointments/appointments.module';
import { AreasModule } from '@areas/areas.module';
import { DashboardModule } from '@dashboard/dashboard.module';
import { EmailModule } from '@email/email.module';
import { ProfessionalsModule } from '@professionals/professionals.module';
import { SpecializationsModule } from '@specializations/specializations.module';
import { StatisticsModule } from '@statistics/statistics.module';
import { TitlesModule } from '@titles/titles.module';
import { UsersModule } from '@users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('DATABASE'),
        autoCreate: false,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    AdminModule,
    AppointmentsModule,
    AreasModule,
    DashboardModule,
    EmailModule,
    ProfessionalsModule,
    SpecializationsModule,
    StatisticsModule,
    TitlesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
