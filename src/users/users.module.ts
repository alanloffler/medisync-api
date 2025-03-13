import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@users/schema/user.schema';
import { UsersController } from '@users/users.controller';
import { UsersService } from '@users/users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [JwtService, UsersService],
  exports: [MongooseModule],
})
export class UsersModule {}
