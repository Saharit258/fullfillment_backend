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
import { OrderFilterDTO, OrderItemFilterDTO } from './dto/order-filter.dto';
import { OrderNo } from 'src/entities/orderno.entity';
import { PageOptionsDto } from '../item/dto/create-item.dto';

@Controller('records')
@ApiTags('record')
export class OrdernoController {
  constructor(private readonly ordernoService: OrdernoService) {}

  @Get('item')
  async getOrderItem(@Query() body: OrderItemFilterDTO) {
    const data = await this.ordernoService.getOrderItemSummary(body);
    return { data };
  }

  @Get('items')
  async queryBilder(
    @Query() body: OrderItemFilterDTO,
    @Query() query: PageOptionsDto,
  ) {
    const pagination = await this.ordernoService.getOrderItemSummarys(
      body,
      query,
    );
    return { data: pagination.result, mate: pagination.metadata };
  }
}
