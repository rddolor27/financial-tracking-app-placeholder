import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthProvider } from './auth.providers';
import { AUTH_SERVICE } from './auth.constants';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { RefreshToken } from './refresh-token.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [AuthProvider, JwtStrategy, GoogleStrategy],
  exports: [AUTH_SERVICE, JwtStrategy],
})
export class AuthModule {}
