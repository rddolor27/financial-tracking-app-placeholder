import { IsString, IsOptional } from 'class-validator';

export class RefreshTokenDto {
  // Optional: web clients send the refresh token via httpOnly cookie instead
  // of the body; mobile / API clients send it here.
  @IsString()
  @IsOptional()
  refresh_token?: string;
}
