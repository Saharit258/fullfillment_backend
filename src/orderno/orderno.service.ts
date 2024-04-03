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

      function generateShorderNo() {
        const letters = generateRandomAlphaNumeric(7);
        const numbers = generateRandomAlphaNumeric(3);
        return `${letters}${numbers}`;
      }

      function generateRandomAlphaNumeric(length: number) {
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += alphanumeric.charAt(
            Math.floor(Math.random() * alphanumeric.length),
          );
        }
        return result;
      }

      let orderNoNumber = generateShorderNo();

      let isUnique = false;
      while (!isUnique) {
        const existingOrder = await this.orderRepository.findOne({
          where: { orderNumber: orderNoNumber },
        });
        if (!existingOrder) {
          isUnique = true;
        } else {
          orderNoNumber = generateShorderNo();
        }
      }

      const newOrder = this.orderRepository.create({
        orderNumber: orderNoNumber,
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
      relations: { order: true, item: true },
    });
    return data;
  }
}
