import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CheckoutRequestDto {
  @IsUUID()
  @IsNotEmpty()
  plan_id: string;

  @IsEnum(['web', 'mobile'])
  @IsNotEmpty()
  platform: 'web' | 'mobile';

  @IsEnum(['free', 'one_time', 'monthly'])
  @IsNotEmpty()
  billing_type: 'free' | 'one_time' | 'monthly';

  @IsEnum(['card', 'gcash', 'maya', 'grabpay', 'bpi_online', 'unionbank'])
  @IsOptional()
  payment_method?: 'card' | 'gcash' | 'maya' | 'grabpay' | 'bpi_online' | 'unionbank';
}
