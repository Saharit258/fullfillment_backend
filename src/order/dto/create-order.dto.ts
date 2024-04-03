import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  customerName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  uom: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cod: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  alley: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  road: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  zipCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  province: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parish: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country: string;

  // @ApiProperty()
  // @IsNumber()
  // @IsOptional()
  // amount: number;

  // @ApiProperty()
  // @IsOptional()
  // items: number[];
}
