import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AdminModule } from '@admin/admin.module';
import { AppointmentsModule } from '@appointments/appointments.module';
import { AreasModule } from '@areas/areas.module';
import { AuthModule } from '@auth/auth.module';
import { DashboardModule } from '@dashboard/dashboard.module';
import { EmailModule } from '@email/email.module';
import { ProfessionalsModule } from '@professionals/professionals.module';
import { SpecializationsModule } from '@specializations/specializations.module';
import { StatisticsModule } from '@statistics/statistics.module';
import { TitlesModule } from '@titles/titles.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
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
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow<string>('I18N_FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: configService.get<string>('NODE_ENV') === 'development' ? join(process.cwd(), 'src/i18n/') : join(__dirname, '/i18n/'),
          watch: true,
          infer: true,
        },
        typesOutputPath: join(__dirname, '../src/i18n/i18n.generated.ts'),
      }),
      resolvers: [new HeaderResolver(['x-lang']), AcceptLanguageResolver],
    }),
    AdminModule,
    AppointmentsModule,
    AreasModule,
    AuthModule,
    DashboardModule,
    EmailModule,
    ProfessionalsModule,
    SpecializationsModule,
    StatisticsModule,
    TitlesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
