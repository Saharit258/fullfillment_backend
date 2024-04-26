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
import { HistoryFilterDto } from './dto/history-filter.dto';
import { paginate } from 'nestjs-typeorm-paginate';

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
        where: { item: { id: itemId } },
      });
      return getHistoryById;
    } catch (error) {}
  }

  async getHistoryByIdFilter(itemId: number, body: HistoryFilterDto) {
    try {
      const { startDate, endDate } = body;

      let queryBuilder = this.historyRepository
        .createQueryBuilder('history')
        .orderBy('history.id', 'DESC')
        .where('history.itemId = :itemId', { itemId });

      if (startDate && endDate) {
        queryBuilder.andWhere(
          'history.outDate BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      }

      const result = await queryBuilder.getMany();
      return result;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
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
    }

    const saveHistory = await this.historyRepository.save(newhistory);
    itemToUpdate.quantity = sumQuantity.sum + body.quantity;
    await this.itemRepository.save(itemToUpdate);
    return { saveHistory };
  }

  //--------------------------------------------------------addHistory หลายตัว---------------------------------------------------//

  async addHistoryss(history: CreateHistoryDto[]) {
    const currentDate = new Date();

    const promises = await Promise.all(
      history.map(async (body) => {
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
      }),
    );
    return promises;
  }
}
