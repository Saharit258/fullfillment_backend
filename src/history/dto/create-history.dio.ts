import { Stores } from './../../entities/stores.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Item } from 'src/entities/item.entity';

export class CreateHistoryDto {
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
