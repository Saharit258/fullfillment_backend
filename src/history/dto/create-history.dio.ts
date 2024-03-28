import { Stores } from './../../entities/stores.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { item } from 'src/entities/item.entity';

export class CreateHistoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  order: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  note: string;

  @ApiProperty()
  outDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  remark: string;

  @ApiProperty()
  item: number;
}
