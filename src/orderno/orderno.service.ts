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
import { OrderItemFilterDTO } from './dto/order-filter.dto';

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

      const random = () => {
        let code = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (let i = 0; i < 10; i++) {
          code += characters.charAt(
            Math.floor(Math.random() * characters.length),
          );
        }

        let numCount = 0;
        for (let i = 0; i < code.length; i++) {
          if (!isNaN(parseInt(code[i]))) {
            numCount++;
          }
        }

        while (numCount < 3) {
          const index = Math.floor(Math.random() * code.length);
          if (isNaN(parseInt(code[index]))) {
            code =
              code.substring(0, index) +
              Math.floor(Math.random() * 10).toString() +
              code.substring(index + 1);
            numCount++;
          }
        }

        return code;
      };

      const randomCodeOrderNo = random();

      const newOrder = this.orderRepository.create({
        customerName: collect.customerName,
        orderCode: randomCodeOrderNo,
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
      relations: { item: { stores: true } },
      order: { id: 'DESC' },
    });
    return data;
  }

  async queryBilderOrderItem(body: OrderItemFilterDTO) {
    const { sku, startDate, endDate, storesName } = body;
    const data = this.ordernoRepository
      .createQueryBuilder('orderno')
      .leftJoinAndSelect('orderno.item', 'item')
      .leftJoinAndSelect('orderno.order', 'order')
      .leftJoinAndSelect('item.stores', 'stores')
      .orderBy('orderno.id', 'DESC');

    if (sku) {
      data.andWhere('item.sku like :sku', {
        sku: `%${sku}%`,
      });
    }

    if (startDate && endDate) {
      data.andWhere('order.orderDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (storesName) {
      data.andWhere('stores.name like :storesName', {
        storesName: `%${storesName}%`,
      });
    }

    return await data.getMany();
  }
}
