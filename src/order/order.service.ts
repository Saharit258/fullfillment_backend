import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { OrderStatus } from './dto/order-enum';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import { ApiOperation } from '@nestjs/swagger';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async addOrder(body: CreateOrderDto) {
    try {
      const currentDate = new Date();

      const generateRandomAlphaNumeric = (length: number) => {
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += alphanumeric.charAt(
            Math.floor(Math.random() * alphanumeric.length),
          );
        }
        return result;
      };

      const generateShorderNo = () => {
        const letters = generateRandomAlphaNumeric(7);
        const numbers = generateRandomAlphaNumeric(3);
        return `${letters}${numbers}`;
      };

      const orderNo = generateShorderNo();

      const newItems = body.items.map((itemId) => {
        return this.orderRepository.create({
          orderNo: orderNo,
          customerName: body.customerName,
          uom: body.uom,
          cod: body.cod,
          orderDate: currentDate,
          phoneNumber: body.phoneNumber,
          address: body.address,
          alley: body.alley,
          road: body.road,
          zipCode: body.zipCode,
          province: body.province,
          district: body.district,
          parish: body.parish,
          country: body.country,
          amount: body.amount,
          status: OrderStatus.NotChecked,
          item: { id: itemId },
        });
      });

      return await this.orderRepository.save(newItems);
    } catch (error) {
      throw new Error(`ไม่สามารถเพิ่มได้ ${error.message}`);
    }
  }

  //--------------------------------------------------------searchOrders-----------------------------------------------------------//

  async searchOrders(
    customerName: string,
    phoneNumber: string,
    address: string,
    status: string,
  ): Promise<Order[]> {
    let options: FindManyOptions<Order> = {};

    if (customerName) {
      options.where = { customerName: Like(`%${customerName}%`) };
    }

    if (phoneNumber) {
      options.where = { phoneNumber: Like(`%${phoneNumber}%`) };
    }

    if (address) {
      options.where = { address: Like(`%${address}%`) };
    }

    if (status) {
      options.where = { status: Like(`%${status}`) };
    }

    return await this.orderRepository.find(options);
  }

  //----------------------------------------------แสดงข้อมูลOrder------------------------------------------------------------------//

  async getOrder() {
    try {
      const data = this.orderRepository.find({
        relations: { item: true },
      });
      return data;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
