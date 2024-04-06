import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdernoService } from './orderno.service';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { CreateOrdernoDto } from './dto/create-orderno.dto';
import { UpdateOrdernoDto } from './dto/update-orderno.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrderFilterDTO } from './dto/order-filter.dto';
import { OrderNo } from 'src/entities/orderno.entity';

@Controller('records')
@ApiTags('Record')
export class OrdernoController {
  constructor(private readonly ordernoService: OrdernoService) {}

  @Get('item')
  async getOrderItem(): Promise<{
    data: OrderNo[];
  }> {
    const data = await this.ordernoService.getOrderItem();
    return { data };
  }
}
