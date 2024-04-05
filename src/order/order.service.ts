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
import { HistoryOrder } from '../entities/historyorder.entity';
import { OrderFilterDTO } from 'src/orderno/dto/order-filter.dto';
import { UpdateStatusMultipleDto } from '../order/dto/update-order.dto';
import { MultiIds } from 'src/item/dto/create-item.dto';

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
    @InjectRepository(HistoryOrder)
    private historyOrderRepository: Repository<HistoryOrder>,
  ) {}

  //-----------------------------------------------------getOrder-----------------------------------------------------------------//

  // async getOrder(): Promise<Order[]> {
  //   try {
  //     const data = await this.orderRepository.find({
  //       relations: ['orderno', 'orderno.item'],
  //       order: { id: 'DESC' },
  //     });
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  //-------------------------------------------------------getOrderById------------------------------------------------------------//

  async getOrderById(id: number): Promise<Order> {
    const getOrderById = await this.orderRepository.findOne({
      where: { id },
      relations: { orderno: true },
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
      await this.orderNoRepository.remove(order.orderno);

      let total = 0;

      const addorderno = body.item.map((item) => {
        total += item.qty;
        return this.orderNoRepository.create({
          quantity: item.qty,
          order: { id: order.id },
          item: { id: item.itemId },
        });
      });

      await this.orderNoRepository.save(addorderno);

      await this.orderRepository.update(order.id, { quantity: total });

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
      body.status === OrderStatus.OUTOFSTOCK &&
      previousStatus !== OrderStatus.OUTOFSTOCK
    ) {
      const orderNos = await this.orderNoRepository.find({
        where: { order: order },
        relations: ['item'],
      });

      for (const orderNo of orderNos) {
        const item = orderNo.item;
        item.quantity -= orderNo.quantity;
        if (item.quantity < 0) {
          throw new BadRequestException('จำนวนของไม่พอ');
        }
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

    if (
      body.status === OrderStatus.RETURNED &&
      previousStatus !== OrderStatus.RETURNED
    ) {
      const orderNos = await this.orderNoRepository.find({
        where: { order: order },
        relations: ['item'],
      });

      for (const orderNo of orderNos) {
        const item = orderNo.item;
        item.quantity += orderNo.quantity;
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

    const currentDate = new Date();

    const addHistoryOrder = this.historyOrderRepository.create({
      orderStatusDate: currentDate,
      status: previousStatus,
      order: { id: order.id },
    });

    await this.historyOrderRepository.save(addHistoryOrder);

    return order;
  }

  //--------------------------------------------------------แก้ไขสถานะหลายๆอัน-----------------------------------------------------//

  async updateOrderStatusMultiple(data: {
    orderId: number[];
    status: UpdateOrderstatusDto;
  }): Promise<Order[]> {
    const { orderId, status } = data;
    const { status: newStatus } = status;

    const orders = await this.orderRepository.findByIds(orderId);

    for (const order of orders) {
      if (!order) {
        throw new NotFoundException(`Order not found with ID ${order.id}`);
      }

      const previousStatus = order.status;

      order.status = OrderStatus[newStatus as keyof typeof OrderStatus];
      await this.orderRepository.save(order);

      if (
        order.status === OrderStatus.OUTOFSTOCK &&
        previousStatus !== OrderStatus.OUTOFSTOCK
      ) {
        const orderNos = await this.orderNoRepository.find({
          where: { order: order },
          relations: ['item'],
        });

        for (const orderNo of orderNos) {
          const item = orderNo.item;
          item.quantity -= orderNo.quantity;
          if (item.quantity < 0) {
            throw new BadRequestException('จำนวนของไม่พอ');
          }
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

      if (
        order.status === OrderStatus.RETURNED &&
        previousStatus !== OrderStatus.RETURNED
      ) {
        const orderNos = await this.orderNoRepository.find({
          where: { order: order },
          relations: ['item'],
        });

        for (const orderNo of orderNos) {
          const item = orderNo.item;
          item.quantity += orderNo.quantity;
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

      const currentDate = new Date();

      const status = order.status;

      const addHistoryOrder = this.historyOrderRepository.create({
        orderStatusDate: currentDate,
        status: status,
        order: { id: order.id },
      });

      await this.historyOrderRepository.save(addHistoryOrder);
    }

    return orders;
  }

  //--------------------------------------------------------getHistory------------------------------------------------------------//

  async getHistoryOrderByOrderId(orderId: number) {
    const data = await this.historyOrderRepository.findOne({
      where: { order: { id: orderId } },
    });
    return data;
  }

  async queryBilder(body: OrderFilterDTO) {
    const {
      id,
      customerName,
      status,
      uom,
      cod,
      phoneNumber,
      address,
      alley,
      road,
      zipCode,
      province,
      parish,
      district,
      country,
      orderDate,
    } = body;
    const data = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderno', 'orderno')
      .leftJoinAndSelect('orderno.item', 'item')
      .orderBy('order.id', 'DESC');

    if (id) {
      data.andWhere('order.id = :id', { id });
    }

    if (status) {
      data.andWhere('order.status = :status', { status });
    }

    if (customerName) {
      data.andWhere('order.customerName = :status', { customerName });
    }

    if (uom) {
      data.andWhere('order.uom = uom', { uom });
    }

    if (cod) {
      data.andWhere('order.cod = cod', { cod });
    }

    if (phoneNumber) {
      data.andWhere('order.phoneNumber = phoneNumber', { phoneNumber });
    }

    if (address) {
      data.andWhere('order.address = address', { address });
    }

    if (alley) {
      data.andWhere('order.alley = alley', { alley });
    }

    if (road) {
      data.andWhere('order.road = road', { road });
    }

    if (zipCode) {
      data.andWhere('order.zipCode = zipCode', { zipCode });
    }

    if (province) {
      data.andWhere('order.province = province', { province });
    }

    if (parish) {
      data.andWhere('order.parish = parish', { parish });
    }

    if (district) {
      data.andWhere('order.district = district', { district });
    }

    if (country) {
      data.andWhere('order.country = country', { country });
    }

    if (orderDate) {
      data.andWhere('order.orderDate = orderDate', { orderDate });
    }

    return await data.getMany();
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

  async removeOrder(body: MultiIds) {
    const deletedItems = await Promise.all(
      body.ids.map(async (id) => {
        const order = await this.getOrderById(id);
        if (!order) {
          throw new NotFoundException(`Order with ID ${id} not found.`);
        }

        if (
          order.status !== OrderStatus.OUTOFSTOCK &&
          order.status !== OrderStatus.DELIVERED &&
          order.status !== OrderStatus.RETURNED
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
      }),
    );
  }
}
