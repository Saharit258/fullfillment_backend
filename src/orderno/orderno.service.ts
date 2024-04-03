import { item } from './../entities/item.entity';
import { Injectable } from '@nestjs/common';
import { CreateOrdernoDto } from './dto/create-orderno.dto';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderNo } from '../entities/orderno.entity';
import { Order } from '../entities/order.entity';
// import { item } from '../entities/item.entity'; // Corrected import
import { OrderStatus } from './dto/order-enum';

@Injectable()
export class OrdernoService {
  constructor(
    @InjectRepository(OrderNo)
    private ordernoRepository: Repository<OrderNo>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    // @InjectRepository(item) // Corrected injection
    // private itemRepository: Repository<item>, // Corrected injection
  ) {}

  //------------------------------------------------เพิ่มข้อมูล-----------------------------------------------------------------------//

  async addOrder(collect: CreateOrdernoDto) {
    try {
      const currentDate = new Date();

      const newOrder = this.orderRepository.create({
        customerName: collect.customerName,
        uom: collect.uom,
        cod: collect.cod,
        orderDate: currentDate,
        phoneNumber: collect.phoneNumber,
        address: collect.address,
        alley: collect.alley,
        road: collect.road,
        zipCode: collect.zipCode,
        province: collect.province,
        district: collect.district,
        parish: collect.parish,
        country: collect.country,
        amount: collect.amount,
        status: OrderStatus.NotChecked,
      } as Partial<Order>);

      const savedOrder = await this.orderRepository.save(newOrder);

      const newOrderNo = collect.item.map((itemId) => {
        return this.ordernoRepository.create({
          amount: collect.amount,
          order: savedOrder,
          item: { id: itemId },
        });
      });

      await this.ordernoRepository.save(newOrderNo);

      return savedOrder;
    } catch (error) {
      throw new Error(`Unable to add order: ${error.message}`);
    }
  }

  //----------------------------------------------------แสดงข้อมูล----------------------------------------------------------------//

  async getOrders() {
    const data = await this.ordernoRepository.find({
      relations: { item: true },
    });
    return data;
  }

  async getOrderItem() {
    try {
      const data = await this.orderRepository.find({
        relations: ['orderno', 'orderno.item'],
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
