import { Stores } from './../entities/stores.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { history } from '../entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dio';
import { item } from '../entities/item.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(history)
    private historyRepository: Repository<history>,
    @InjectRepository(item)
    private itemRepository: Repository<item>,
  ) {}

  async getHistorys() {
    const getHistorys = await this.historyRepository.find({
      order: { id: 'DESC' },
      relations: {
        item: true,
        lot: true,
      },
    });

    return getHistorys;
  }

  async getHistory(option: FindOneOptions) {
    const getHistory = await this.historyRepository.findOne(option);
    return getHistory;
  }

  async getHistoryByIdItem(option: FindManyOptions) {
    //การใช้งานข้อมูลใน calom
    const getHistoryByIdItem = await this.historyRepository.find(option);
    return getHistoryByIdItem;
  }

  async getHistoryById(itemId: number) {
    try {
      const getHistoryById = await this.getHistoryByIdItem({
        where: { item: { id: itemId } }, //การดึงไอดีจากไอเทม
      });
      return getHistoryById;
    } catch (error) {}
  }

  //บวกในข้อมูล
  async summaryQuantity(id: number) {
    const sum = await this.historyRepository
      .createQueryBuilder('history')
      .select('SUM(history.quantity)::int4', 'sum')
      .where('history.itemId = :id', { id })
      .getRawOne();
    return sum;
  }

  async getItems(id: number) {
    const getItems1 = await this.itemRepository.findOne({
      where: { id },
    });
    return getItems1;
  }

  async addHistorys(body: CreateHistoryDto) {
    const itemToUpdate = await this.getItems(body.item);
    if (!itemToUpdate) {
      throw new NotFoundException(`Item with ID not found`);
    }

    const currentDate = new Date();

    const newhistory = this.historyRepository.create({
      order: body.order,
      outDate: currentDate,
      quantity: body.quantity,
      remark: body.remark,
      item: { id: body.item },
    });

    const sumQuantity = await this.summaryQuantity(itemToUpdate.id);

    if (sumQuantity.sum + body.quantity < 0) {
      throw new BadRequestException('จำนวนของไม่พอ');
    } else {
      const saveHistory = await this.historyRepository.save(newhistory);
      itemToUpdate.quantity = sumQuantity.sum + body.quantity;
      await this.itemRepository.save(itemToUpdate);
      return { saveHistory };
    }
  }

  //addHistory หลายตัว
  // async addHistoryss(bodies: CreateHistoryDto[]) {
  //   const currentDate = new Date();

  //   const promises = bodies.map(async (body) => {
  //     const itemToUpdate = await this.getItems(body.item);
  //     if (!itemToUpdate) {
  //       throw new NotFoundException(`Item with ID ${body.item} not found`);
  //     }

  //     const newHistory = this.historyRepository.create({
  //       order: body.order,
  //       outDate: currentDate,
  //       quantity: body.quantity,
  //       remark: body.remark,
  //       item: { id: body.item },
  //     });

  //     const savedHistory = await this.historyRepository.save(newHistory);
  //     const sumQuantity = await this.summaryQuantity(itemToUpdate.id);
  //     itemToUpdate.quantity = sumQuantity.sum;
  //     await this.itemRepository.save(itemToUpdate);

  //     return savedHistory;
  //   });

  //   const savedHistories = await Promise.all(promises);

  //   return { savedHistories };
  // }
}
