import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderstatusDto } from './dto/update-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { ApiOperation } from '@nestjs/swagger';
import { OrderStatusFilterDTO } from './dto/orderstatus-filter.dto';
import { OrderNo } from '../entities/orderno.entity';
import { OrderStatus } from '../orderno/dto/order-enum';
import { Item } from '../entities/item.entity';
import { History } from '../entities/history.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderNo)
    private orderNoRepository: Repository<OrderNo>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  async getOrder() {
    try {
      const data = await this.orderRepository.find({
        relations: ['orderno', 'orderno.item'],
        order: { id: 'DESC' },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  //-------------------------------------------------------getOrderById------------------------------------------------------------//

  async getOrderById(id: number) {
    const getOrderById = await this.orderRepository.findOne({
      where: { id },
    });
    return getOrderById;
  }

  //--------------------------------------------------------PutOrder---------------------------------------------------------------//

  async updateOrder(id: number, body: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found.`);
      }
      Object.assign(order, { ...body });

      await this.orderRepository.save(order);

      return order;
    } catch (error) {
      throw new BadRequestException(`Failed to update order: ${error.message}`);
    }
  }

  //--------------------------------------------------------PutOrderStatus---------------------------------------------------------//

  async updateOrderStatus(
    id: number,
    body: UpdateOrderstatusDto,
  ): Promise<Order> {
    const order = await this.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    const previousStatus = order.status;

    order.status = body.status;
    await this.orderRepository.save(order);

    if (
      body.status === OrderStatus.OutOfStock &&
      previousStatus !== OrderStatus.OutOfStock
    ) {
      const orderNos = await this.orderNoRepository.find({
        where: { order: order },
        relations: ['item'],
      });

      for (const orderNo of orderNos) {
        const item = orderNo.item;
        item.quantity -= orderNo.quantity;
        await this.itemRepository.save(item);
      }

      const currentDate = new Date();

      for (const orderNo of orderNos) {
        const historyEntry = new History();
        historyEntry.outDate = currentDate;
        historyEntry.quantity = orderNo.quantity;
        historyEntry.item = orderNo.item;
        await this.historyRepository.save(historyEntry);
      }
    }

    return order;
  }

  //--------------------------------------------------------searchOrders-----------------------------------------------------------//

  async searchOrders(search: string): Promise<Order[]> {
    const options: FindManyOptions<Order> = {
      where: [
        { customerName: Like(`%${search}%`) },
        { status: Like(`%${search}%`) },
        { phoneNumber: Like(`%${search}%`) },
        { address: Like(`%${search}%`) },
        { zipCode: Like(`%${search}%`) },
        { province: Like(`%${search}%`) },
        { district: Like(`%${search}%`) },
        { parish: Like(`%${search}%`) },
        { country: Like(`%${search}%`) },
      ],
      order: { id: 'DESC' },
    };

    return await this.orderRepository.find(options);
  }

  //-------------------------------------------------------searchOrderStatus-----------------------------------------------------//

  async searchOrderStatus(searchs: OrderStatusFilterDTO): Promise<Order[]> {
    const options: FindManyOptions<Order> = {
      where: { status: Like(`%${searchs.status}%`) },
      order: { id: 'DESC' },
    };
    return await this.orderRepository.find(options);
  }

  //-----------------------------------------------------Delete-----------------------------------------------------------------//

  async removeOrder(id: number) {
    const order = await this.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    if (
      order.status !== OrderStatus.OutOfStock &&
      order.status !== OrderStatus.Delivered &&
      order.status !== OrderStatus.Returned
    ) {
      const orderNos = await this.orderNoRepository.find({
        where: { order: order },
      });

      if (orderNos.length > 0) {
        try {
          await this.orderNoRepository.remove(orderNos);
        } catch (error) {
          throw new Error(
            `Failed to delete OrderNo associated with Order ID ${id}: ${error.message}`,
          );
        }
      }

      try {
        await this.orderRepository.remove(order);
        return true;
      } catch (error) {
        throw new Error(
          `Failed to delete order with ID ${id}: ${error.message}`,
        );
      }
    } else {
      throw new BadRequestException('อยู่ในสถานะไม่สามารถลบได้');
    }
  }
}
