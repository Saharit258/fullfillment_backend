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
import { UpdateOrderDto, UpdateOrderstatusDto } from './dto/update-order.dto';
import { OrderFilterDTO } from 'src/orderno/dto/order-filter.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { OrderStatusFilterDTO } from './dto/orderstatus-filter.dto';
import { OrderStatus } from 'src/orderno/dto/order-enum';
import { CreateOrdernoDto } from '../orderno/dto/create-orderno.dto';
import { OrdernoService } from '../orderno/orderno.service';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly ordernoService: OrdernoService,
  ) {}

  //------------------------------------------------------------Post------------------------------------------------------------//

  @Post()
  async addOrder(@Body() collect: CreateOrdernoDto) {
    return await this.ordernoService.addOrder(collect);
  }

  //-------------------------------------------------------------get-------------------------------------------------------------//

  // @Get()
  // async getOrder() {
  //   const data = await this.orderService.getOrder();
  //   return { data };
  // }

  @Get()
  async queryBilder(@Query() body: OrderFilterDTO) {
    const data = await this.orderService.queryBilder(body);
    return { data };
  }

  // @Get('search/status')
  // async searchOrderStatus(@Query() searchs: OrderStatusFilterDTO) {
  //   try {
  //     const data = await this.orderService.searchOrderStatus(searchs);
  //     return { data };
  //   } catch (error) {
  //     throw new HttpException(
  //       `${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

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

  @Delete('/:id')
  async removeOrder(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.orderService.removeOrder(id);
      return { data: {} };
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //-------------------------------------------------------sum--------------------------------------------------------------------//

  // @Get(':id/summary-quantity')
  // async getSummaryQuantity(
  //   @Param('orderId', ParseIntPipe) orderId: number,
  //   @Param('itemId', ParseIntPipe) itemId: number,
  // ) {
  //   try {
  //     const sum = await this.orderService.summaryQuantity(orderId, itemId);
  //     return { sum };
  //   } catch (error) {
  //     throw new HttpException(
  //       `${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
