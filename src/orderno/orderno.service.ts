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
      let randomCodeOrderNo = '';
      let isDuplicate = true;

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

      while (isDuplicate) {
        randomCodeOrderNo = random();
        const existingOrder = await this.orderRepository.findOne({
          where: { orderCode: randomCodeOrderNo },
        });

        if (!existingOrder) {
          isDuplicate = false;
        }
      }

      const currentDate = new Date();

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

  async getOrderItemSummary(body: OrderItemFilterDTO) {
    const { sku, startDate, endDate, storesName } = body;
    const data = this.ordernoRepository
      .createQueryBuilder('order_no')
      .select([
        'order_no.itemId',
        'SUM(order_no.quantity)',
        'item.sku',
        'stores.name',
        'item.quantity',
      ])
      .leftJoin('order_no.item', 'item')
      .leftJoin('order_no.order', 'order')
      .leftJoin('item.stores', 'stores')

      .groupBy('order_no.itemId, item.sku, stores.name, item.quantity');

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

    return data.getRawMany();
  }

  // async getOrderItemSummary(body: OrderItemFilterDTO, query: PageOptionsDto) {
  //   const { sku, startDate, endDate, storesName } = body;

  //   const options = {
  //     page: query.page,
  //     limit: query.limit,
  //   };

  //   const dataQuery = this.ordernoRepository
  //     .createQueryBuilder('order_no')
  //     .select([
  //       'order_no.itemId',
  //       'SUM(order_no.quantity) AS totalQuantity', // Renamed for clarity
  //       'item.sku',
  //       'stores.name AS storeName',
  //       'item.quantity',
  //     ])
  //     .leftJoin('order_no.item', 'item')
  //     .leftJoin('order_no.order', 'order')
  //     .leftJoin('item.stores', 'stores')
  //     .groupBy('order_no.itemId, item.sku, stores.name, item.quantity');

  //   if (sku) {
  //     dataQuery.andWhere('item.sku like :sku', {
  //       sku: `%${sku}%`,
  //     });
  //   }

  //   if (startDate && endDate) {
  //     dataQuery.andWhere('order.orderDate BETWEEN :startDate AND :endDate', {
  //       startDate,
  //       endDate,
  //     });
  //   }

  //   if (storesName) {
  //     dataQuery.andWhere('stores.name like :storesName', {
  //       storesName: `%${storesName}%`,
  //     });
  //   }

  //   const totalCount = await dataQuery.getCount();
  //   const totalPages = Math.ceil(totalCount / query.limit);

  //   options.page = Math.min(options.page, totalPages);
  //   options.page = Math.max(options.page, 1);

  //   const result = await dataQuery
  //     .offset((options.page - 1) * options.limit)
  //     .limit(options.limit)
  //     .getRawMany();

  //   return {
  //     totalCount,
  //     totalPages,
  //     currentPage: options.page,
  //     pageSize: options.limit,
  //     data: result,
  //   };
  // }
}
