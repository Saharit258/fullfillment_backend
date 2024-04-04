import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistoryOrderService } from './history-order.service';
import { CreateHistoryOrderDto } from './dto/create-history-order.dto';
import { UpdateHistoryOrderDto } from './dto/update-history-order.dto';

@Controller('history-order')
export class HistoryOrderController {
  constructor(private readonly historyOrderService: HistoryOrderService) {}
}
