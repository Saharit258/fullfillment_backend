import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateOrderDto } from '../../order/dto/create-order.dto';

export class CreateOrdernoDto extends PartialType(CreateOrderDto) {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  amount: number;

  @ApiProperty({ example: [1, 2, 3] })
  @IsNumber()
  @IsOptional()
  item: number[];
}
