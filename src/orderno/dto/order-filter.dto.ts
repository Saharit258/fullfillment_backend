import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from './order-enum';

export class OrderFilterDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  customerName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  uom: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  cod: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  alley: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  road: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  zipCode: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  province: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  parish: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ required: false })
  @IsOptional()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false, enum: OrderStatus })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  storesName: string;
}

export class OrderItemFilterDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku: string;

  @ApiProperty({ required: false })
  @IsOptional()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  storesName: string;
}
