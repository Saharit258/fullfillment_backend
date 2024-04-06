import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateOrderDto } from '../../order/dto/create-order.dto';

export class CreateOrdernoDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    example: [
      { itemId: 11, qty: 200 },
      { itemId: 14, qty: 200 },
    ],
  })
  @IsNotEmpty()
  item: {
    itemId: number;
    qty: number;
  }[];
}
