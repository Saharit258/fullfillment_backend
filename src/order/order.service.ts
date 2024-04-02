import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '../entities/order.entity';
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

      const newItem = this.orderRepository.create({
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
        item: { id: body.item },
      });
      return await this.orderRepository.save(newItem);
    } catch (error) {
      throw new Error(` ไม่สามารถเพิ่มได้ ${error.message}`);
    }
  }

  //--------------------------------------------------------searchOrders-----------------------------------------------------------//

  async searchOrders(
    customerName: string,
    phoneNumber: string,
    address: string,
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

    return await this.orderRepository.find(options);
  }

  //----------------------------------------------แสดงข้อมูลOrder------------------------------------------------------------------//

  async getOrder() {
    try {
      const data = this.orderRepository.find({ relations: { item: true } });
      return data;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
