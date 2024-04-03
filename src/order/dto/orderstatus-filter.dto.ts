import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'src/orderno/dto/order-enum';

export class OrderStatusFilterDTO {
  @ApiProperty({ enum: OrderStatus })
  @IsString()
  @IsOptional()
  status: string;
}
