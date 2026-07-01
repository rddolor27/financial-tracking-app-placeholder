import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersProvider } from './users.service';
import { USERS_SERVICE } from './users.constants';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersProvider],
  exports: [USERS_SERVICE],
})
export class UsersModule {}
