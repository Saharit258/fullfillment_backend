import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { OrderStatus } from 'src/orderno/dto/order-enum';

export class UpdateOrderstatusDto {
  @ApiProperty({ enum: OrderStatus, example: [{ status: 'RETURNED' }] })
  @IsString()
  status: string;
}

export class UpdateOrderDto {
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

  @ApiProperty({
    example: [
      { itemId: 11, qty: 200 },
      { itemId: 14, qty: 200 },
    ],
  })
  @IsOptional()
  item: {
    itemId: number;
    qty: number;
  }[];
}

export class UpdateStatusMultipleDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsNumber()
  orderId: number[];

  @ApiProperty({ example: { status: 'RETURNED' } })
  @IsString()
  status: string;
}
