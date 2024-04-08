import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderFilterDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  storesName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shipperCode: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shipperName: string;
}
