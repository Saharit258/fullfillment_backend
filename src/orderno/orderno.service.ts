import { Item } from './../entities/item.entity';
import { Injectable } from '@nestjs/common';
import { CreateOrdernoDto } from './dto/create-orderno.dto';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
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

  async addOrder(collect: CreateOrdernoDto): Promise<OrderNo[]> {
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
        quantity: 0,
        status: OrderStatus.NOTCHECKED,
      });

      const savedOrder = await this.orderRepository.save(newOrder);

      let totalAmount = 0;

      const newOrderNos = collect.item.map((item) => {
        totalAmount += item.qty;
        const newOrderNo = this.ordernoRepository.create({
          quantity: item.qty,
          order: savedOrder,
          item: { id: item.itemId },
        });
        return newOrderNo;
      });

      await this.ordernoRepository.save(newOrderNos);

      savedOrder.quantity = totalAmount;
      await this.orderRepository.save(savedOrder);

      return newOrderNos;
    } catch (error) {
      throw new Error(`Unable to add order: ${error.message}`);
    }
  }

  //----------------------------------------------------แสดงข้อมูล----------------------------------------------------------------//

  async getOrderItem(): Promise<OrderNo[]> {
    const data = await this.ordernoRepository.find({
      relations: ['item', 'item.stores'],
      order: { id: 'DESC' },
    });
    return data;
  }
}
