import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class itemFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  details: string;

  @ApiProperty({ required: false })
  @IsOptional()
  stores: string;

  @ApiProperty({ required: false })
  @IsOptional()
  everything: string;
}
