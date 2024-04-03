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

@Controller('order')
@ApiTags('order')
export class OrdernoController {
  constructor(private readonly ordernoService: OrdernoService) {}

  @Post()
  async addOrder(@Body() collect: CreateOrdernoDto) {
    return await this.ordernoService.addOrder(collect);
  }

  @Get('item')
  async getOrderItem() {
    const data = await this.ordernoService.getOrders();
    return { data };
  }

  @Get()
  async getOrders() {
    const data = await this.ordernoService.getOrderItem();
    return { data };
  }
}
