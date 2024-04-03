import { PartialType } from '@nestjs/swagger';
import { CreateOrdernoDto } from './create-orderno.dto';

export class UpdateOrdernoDto extends PartialType(CreateOrdernoDto) {}
