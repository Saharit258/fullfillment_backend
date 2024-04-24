import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderstatusDto } from './dto/update-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, IsNull, Like, Not, Repository } from 'typeorm';
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
import { MultiIds, PageOptionsDto } from 'src/item/dto/create-item.dto';
import { paginate } from 'nestjs-typeorm-paginate';

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
      relations: { orderno: { item: { stores: true } } },
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

  //--------------------------------------------------------แก้ไขสถานะหลายๆอัน-----------------------------------------------------//

  async updateOrderStatusMultiple(data: {
    orderId: number[];
    status: UpdateOrderstatusDto;
  }): Promise<Order[]> {
    const { orderId, status } = data;
    const { status: newStatus } = status;

    const orders = await this.orderRepository.find({
      where: {
        id: In(orderId),
      },
    });

    for (const order of orders) {
      if (!order) {
        throw new NotFoundException(`Order not found with ID ${order.id}`);
      }

      const previousStatus = order.status;

      if (
        previousStatus === OrderStatus.NOTCHECKED &&
        (newStatus === OrderStatus.INPROGRESS ||
          newStatus === OrderStatus.DELIVERED ||
          newStatus === OrderStatus.RETURNED ||
          newStatus === OrderStatus.RETURNEDITEM)
      ) {
        throw new BadRequestException(
          `Cannot transition from ${previousStatus} to ${newStatus}`,
        );
      }

      if (
        previousStatus === OrderStatus.OUTOFSTOCK &&
        (newStatus === OrderStatus.NOTCHECKED ||
          newStatus === OrderStatus.DELIVERED ||
          newStatus === OrderStatus.RETURNED ||
          newStatus === OrderStatus.RETURNEDITEM)
      ) {
        throw new BadRequestException(
          `Cannot transition from ${previousStatus} to ${newStatus}`,
        );
      }

      if (
        previousStatus === OrderStatus.INPROGRESS &&
        (newStatus === OrderStatus.NOTCHECKED ||
          newStatus === OrderStatus.OUTOFSTOCK)
      ) {
        throw new BadRequestException(
          `Cannot transition from ${previousStatus} to ${newStatus}`,
        );
      }

      if (
        previousStatus === OrderStatus.DELIVERED &&
        (newStatus === OrderStatus.NOTCHECKED ||
          newStatus === OrderStatus.OUTOFSTOCK ||
          newStatus === OrderStatus.INPROGRESS ||
          newStatus === OrderStatus.RETURNED)
      ) {
        throw new BadRequestException(
          `Cannot transition from ${previousStatus} to ${newStatus}`,
        );
      }

      if (
        previousStatus === OrderStatus.RETURNED &&
        (newStatus === OrderStatus.NOTCHECKED ||
          newStatus === OrderStatus.OUTOFSTOCK ||
          newStatus === OrderStatus.INPROGRESS ||
          newStatus === OrderStatus.DELIVERED)
      ) {
        throw new BadRequestException(
          `Cannot transition from ${previousStatus} to ${newStatus}`,
        );
      }

      order.status = OrderStatus[newStatus as keyof typeof OrderStatus];
      await this.orderRepository.save(order);

      if (order.status === OrderStatus.INPROGRESS) {
        const orderNos = await this.orderNoRepository.find({
          where: { order: order },
          relations: ['item'],
        });

        for (const orderNo of orderNos) {
          const item = orderNo.item;
          const updatedQuantity = item.quantity - orderNo.quantity;
          if (updatedQuantity < 0) {
            await this.orderRepository.update(order.id, {
              status: OrderStatus.OUTOFSTOCK,
            });
            throw new BadRequestException('จำนวนของไม่พอ');
          }
          item.quantity = updatedQuantity;
        }

        for (const orderNo of orderNos) {
          const item = orderNo.item;
          await this.itemRepository.save(item);
        }

        const currentDate = new Date();

        for (const orderNo of orderNos) {
          const historyEntry = new History();
          historyEntry.outDate = currentDate;
          historyEntry.quantity = -orderNo.quantity;
          historyEntry.item = orderNo.item;
          await this.historyRepository.save(historyEntry);
        }
      }

      if (order.status === OrderStatus.RETURNEDITEM) {
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
        status: order.status,
        order: { id: order.id },
      });

      await this.historyOrderRepository.save(addHistoryOrder);
    }

    return orders;
  }

  //--------------------------------------------------------getHistory------------------------------------------------------------//

  async getHistoryOrderByOrderId(orderId: number) {
    const data = await this.historyOrderRepository.find({
      where: {
        order: { id: orderId },
        status: Not(IsNull()),
      },
      relations: { order: { orderno: true } },
    });
    return data;
  }

  //---------------------------------------------------queryBilder-------------------------------------------------------------//

  async queryBilder(body: OrderFilterDTO, query: PageOptionsDto) {
    const {
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
      startDate,
      endDate,
      storesName,
    } = body;

    const options = {
      page: query.page,
      limit: query.limit,
    };

    const data = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderno', 'orderno')
      .leftJoinAndSelect('orderno.item', 'item')
      .leftJoinAndSelect('item.stores', 'stores')
      .where('order.status != :excludedStatus', {
        excludedStatus: 'RETURNEDITEM',
      })
      .orderBy('order.id', 'DESC');

    if (status) {
      data.andWhere('order.status = :status', { status });
    }

    if (storesName) {
      data.andWhere('stores.name like :storesName', {
        storesName: `%${storesName}%`,
      });
    }

    if (customerName) {
      data.andWhere('order.customerName like :customerName', {
        customerName: `%${customerName}%`,
      });
    }

    if (uom) {
      data.andWhere('order.uom like :uom', { uom: `%${uom}%` });
    }

    if (cod) {
      data.andWhere('order.cod like :cod', { cod: `%${cod}%` });
    }

    if (phoneNumber) {
      data.andWhere('order.phoneNumber like :phoneNumber', {
        phoneNumber: `%${phoneNumber}%`,
      });
    }

    if (address) {
      data.andWhere('order.address like :address', { address: `%${address}%` });
    }

    if (alley) {
      data.andWhere('order.alley like :alley', { alley: `%${alley}%` });
    }

    if (road) {
      data.andWhere('order.road like :road', { road: `%${road}%` });
    }

    if (zipCode) {
      data.andWhere('order.zipCode like :zipCode', { zipCode: `%${zipCode}%` });
    }

    if (province) {
      data.andWhere('order.province like :province', {
        province: `%${province}%`,
      });
    }

    if (parish) {
      data.andWhere('order.parish like :parish', { parish: `%${parish}%` });
    }

    if (district) {
      data.andWhere('order.district like :district', {
        district: `%${district}%`,
      });
    }

    if (country) {
      data.andWhere('order.country like :country', {
        country: `%${country}%`,
      });
    }

    if (startDate && endDate) {
      data.andWhere('order.orderDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const dataOrder = await paginate(data, options);
    return dataOrder;
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
          order.status !== OrderStatus.INPROGRESS &&
          order.status !== OrderStatus.DELIVERED &&
          order.status !== OrderStatus.RETURNED
        ) {
          const removeOrderNo = await this.orderNoRepository.find({
            where: { order: order },
          });

          const removeHistoryOrderNo = await this.historyOrderRepository.find({
            where: { order: order },
          });

          if (removeOrderNo.length > 0) {
            this.orderNoRepository.remove(removeOrderNo);
          }

          if (removeHistoryOrderNo.length > 0) {
            this.historyOrderRepository.remove(removeHistoryOrderNo);
          }

          await this.orderRepository.remove(order);
        } else {
          throw new BadRequestException('อยู่ในสถานะไม่สามารถลบได้');
        }
      }),
    );
  }
}
