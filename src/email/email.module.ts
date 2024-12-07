import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { EmailController } from '@email/email.controller';
import { EmailService } from '@email/email.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
