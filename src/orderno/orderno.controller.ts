import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdernoService } from './orderno.service';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { CreateOrdernoDto } from './dto/create-orderno.dto';
import { UpdateOrdernoDto } from './dto/update-orderno.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('order')
export class OrdernoController {
  constructor(private readonly ordernoService: OrdernoService) {}

  @Post('key')
  async addOrder(@Body() collect: CreateOrdernoDto) {
    return await this.ordernoService.addOrder(collect);
  }

  @Get()
  async getOrderItem() {
    const data = await this.ordernoService.getOrderItem();
    return { data };
  }
}
