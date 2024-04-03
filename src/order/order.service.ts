import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { ApiOperation } from '@nestjs/swagger';
import { OrderStatusFilterDTO } from './dto/orderstatus-filter.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  //-------------------------------------------------------getOrderById------------------------------------------------------------//

  async getOrderById(id: number) {
    const getOrderById = await this.orderRepository.findOne({
      where: { id },
    });
    return getOrderById;
  }

  //--------------------------------------------------------Put--------------------------------------------------------------------//

  async updateOrderStatus(id: number, body: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    order.status = body.status;
    await this.orderRepository.save(order);

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
    };

    return await this.orderRepository.find(options);
  }

  //-------------------------------------------------------searchOrderStatus-----------------------------------------------------//

  async searchOrderStatus(searchs: OrderStatusFilterDTO): Promise<Order[]> {
    const options: FindManyOptions<Order> = {
      where: { status: Like(`%${searchs.status}%`) },
    };

    return await this.orderRepository.find(options);
  }
}
