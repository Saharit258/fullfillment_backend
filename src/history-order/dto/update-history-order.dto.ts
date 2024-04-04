import { PartialType } from '@nestjs/swagger';
import { CreateHistoryOrderDto } from './create-history-order.dto';

export class UpdateHistoryOrderDto extends PartialType(CreateHistoryOrderDto) {}
