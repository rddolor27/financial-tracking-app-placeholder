import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SyncChangeDto {
  @IsString()
  @IsNotEmpty()
  entity_type: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

export class SyncPushDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncChangeDto)
  changes: SyncChangeDto[];
}
