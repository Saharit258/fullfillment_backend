import { Injectable } from '@nestjs/common';
import { CreateHistoryOrderDto } from './dto/create-history-order.dto';
import { UpdateHistoryOrderDto } from './dto/update-history-order.dto';

@Injectable()
export class HistoryOrderService {
  create(createHistoryOrderDto: CreateHistoryOrderDto) {}
}
