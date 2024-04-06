import { error } from 'console';
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
  ParseIntPipe,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  UpdateOrderDto,
  UpdateOrderstatusDto,
  UpdateStatusMultipleDto,
} from './dto/update-order.dto';
import { OrderFilterDTO } from 'src/orderno/dto/order-filter.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { OrderStatusFilterDTO } from './dto/orderstatus-filter.dto';
import { OrderStatus } from 'src/orderno/dto/order-enum';
import { CreateOrdernoDto } from '../orderno/dto/create-orderno.dto';
import { OrdernoService } from '../orderno/orderno.service';
import { MultiIds } from 'src/item/dto/create-item.dto';

@Controller('orders')
@ApiTags('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly ordernoService: OrdernoService,
  ) {}

  //------------------------------------------------------------Post------------------------------------------------------------//

  @Post()
  async addOrder(@Body() collect: CreateOrdernoDto) {
    const data = await this.ordernoService.addOrder(collect);
    return { data };
  }

  //-------------------------------------------------------------get-------------------------------------------------------------//

  @Get()
  async queryBilder(@Query() body: OrderFilterDTO) {
    const data = await this.orderService.queryBilder(body);
    return { data };
  }

  @Get('/:id')
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.orderService.getOrderById(id);
      return { data };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history-status/:orderId')
  async getHistoryOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    const data = await this.orderService.getHistoryOrderByOrderId(orderId);
    return { data };
  }

  //----------------------------------------------------Put-----------------------------------------------------------------------//

  @Put('/update-status-multiple')
  @ApiBody({
    schema: {
      properties: {
        orderId: {
          example: [71, 72],
        },
        status: {
          properties: {
            status: {
              example: 'RETURNED',
            },
          },
          required: ['status'],
        },
      },
    },
  })
  async updateOrderStatusMultiple(
    @Body() body: { orderId: number[]; status: UpdateStatusMultipleDto },
  ) {
    try {
      const data = await this.orderService.updateOrderStatusMultiple(body);
      return { data };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderDto,
  ) {
    try {
      const data = await this.orderService.updateOrder(id, body);
      return { data };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/status/:id')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query() updateOrderDto: UpdateOrderstatusDto,
  ) {
    try {
      const data = await this.orderService.updateOrderStatus(
        id,
        updateOrderDto,
      );
      return { data };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //---------------------------------------------------Delete--------------------------------------------------------------------//

  @Delete('/remove-multiple')
  async removeOrder(@Body() body: MultiIds) {
    try {
      await this.orderService.removeOrder(body);
      return { data: {} };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //-------------------------------------------------------แก้ไขสถานะหลายๆอัน------------------------------------------------------//
}
