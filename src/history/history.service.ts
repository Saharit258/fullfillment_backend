import { Stores } from './../entities/stores.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { History } from '../entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dio';
import { Item } from '../entities/item.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  //------------------------------------------------------แสดงประวัติ-------------------------------------------------------------//

  async getHistorys(): Promise<History[]> {
    const getHistorys = await this.historyRepository.find({
      order: { id: 'DESC' },
      relations: {
        item: true,
        lot: true,
      },
    });

    return getHistorys;
  }

  //---------------------------------------------------แสดงข้อมูลตามไอดีสินค้าโดยการใช้Option------------------------------------------//

  async getHistory(option: FindOneOptions): Promise<History> {
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
        order: { id: 'DESC' },
        where: { item: { id: itemId } }, //การดึงไอดีจากไอเทม
      });
      return getHistoryById;
    } catch (error) {}
  }

  //-----------------------------------------------------บวกในข้อมูล-------------------------------------------------------------//
  async summaryQuantity(id: number): Promise<any> {
    const sum = await this.historyRepository
      .createQueryBuilder('history')
      .select('SUM(history.quantity)::int4', 'sum')
      .where('history.itemId = :id', { id })
      .getRawOne();
    return sum;
  }

  async getItems(id: number): Promise<Item> {
    const getItems1 = await this.itemRepository.findOne({
      where: { id },
    });
    return getItems1;
  }

  //-----------------------------------------------------แก้ไขจำนวนสินค้า----------------------------------------------------------//

  async addHistorys(body: CreateHistoryDto): Promise<{
    saveHistory: History;
  }> {
    const itemToUpdate = await this.getItems(body.item);
    if (!itemToUpdate) {
      throw new NotFoundException(`Item with ID not found`);
    }

    const currentDate = new Date();

    const newhistory = this.historyRepository.create({
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

  //--------------------------------------------------------addHistory หลายตัว---------------------------------------------------//
  async addHistoryss(bodies: CreateHistoryDto[]): Promise<{
    savedHistories: History[];
  }> {
    const currentDate = new Date();

    const promises = bodies.map(async (body) => {
      const itemToUpdate = await this.getItems(body.item);
      if (!itemToUpdate) {
        throw new NotFoundException(`Item with ID ${body.item} not found`);
      }

      const newHistory = this.historyRepository.create({
        outDate: currentDate,
        quantity: body.quantity,
        remark: body.remark,
        item: { id: body.item },
      });

      const sumQuantity = await this.summaryQuantity(itemToUpdate.id);
      if (sumQuantity.sum + body.quantity < 0) {
        throw new BadRequestException('จำนวนของไม่พอ');
      }

      const savedHistory = await this.historyRepository.save(newHistory);
      itemToUpdate.quantity = sumQuantity.sum + body.quantity;
      await this.itemRepository.save(itemToUpdate);

      return savedHistory;
    });

    try {
      const savedHistories = await Promise.all(promises);
      return { savedHistories };
    } catch (error) {
      promises.forEach(async (promise) => {
        try {
          const savedHistory = await promise;
          const itemToUpdate = await this.getItems(savedHistory.item.id);
          if (itemToUpdate) {
            const sumQuantity = await this.summaryQuantity(itemToUpdate.id);
            itemToUpdate.quantity = sumQuantity.sum - savedHistory.quantity;
            await this.itemRepository.save(itemToUpdate);
          }
        } catch (error) {
          console.error('Error reverting history update:', error);
        }
      });
      throw error;
    }
  }
}
