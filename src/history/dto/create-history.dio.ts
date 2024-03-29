import { Stores } from './../../entities/stores.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { item } from 'src/entities/item.entity';

export class CreateHistoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  order: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty()
  item: number;
}
