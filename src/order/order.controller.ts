import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrderFilterDTO } from '../order/dto/order-filter.dto';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //-------------------------------------------------------------Post--------------------------------------------------------------//

  @Post()
  async addOrder(@Body() body: CreateOrderDto) {
    try {
      const data = await this.orderService.addOrder(body);
      return { data };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //-------------------------------------------------------------Get--------------------------------------------------------------//

  @Get()
  async getOrder() {
    try {
      const data = await this.orderService.getOrder();
      return { data };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  @Get('search')
  async searchOrders(@Query() query: OrderFilterDTO) {
    try {
      const data = await this.orderService.searchOrders(
        query.customerName,
        query.phoneNumber,
        query.address,
        query.status,
      );
      return { data };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
