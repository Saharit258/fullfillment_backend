import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsString, IsOptional } from 'class-validator';
import { OrderStatus } from 'src/orderno/dto/order-enum';

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsString()
  @IsOptional()
  status: string;
}
