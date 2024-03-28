import { Stores } from './../entities/stores.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  // addHistory(body: CreateHistoryDto) {
  //   const newhistory = this.historyRepository.create({
  //     order: body.order,
  //     outDate: body.outDate,
  //     quantity: body.quantity,
  //     remark: body.remark,
  //     item: { id: body.item },
  //   });

  //   return this.historyRepository.save(newhistory);
  // }

  // async addHistorys(body: CreateHistoryDto) {
  //   const itemToUpdate = await this.getItems(body.item);
  //   if (!itemToUpdate) {
  //     throw new NotFoundException(`Item with ID not found`);
  //   }

  //   const currentDate = new Date(); // Get current date and time

  //   const newhistory = this.historyRepository.create({
  //     order: body.order,
  //     outDate: currentDate, // Set outDate to current date and time
  //     quantity: body.quantity,
  //     remark: body.remark,
  //     item: { id: body.item },
  //   });

  //   const saveHistory = await this.historyRepository.save(newhistory);

  //   const sumQuantity = await this.summaryQuantity(itemToUpdate.id);

  //   itemToUpdate.quantity = sumQuantity.sum;
  //   await this.itemRepository.save(itemToUpdate);

  //   return saveHistory;
  // }

  //addHistory หลายตัว

  // async addHistoryss(bodies: CreateHistoryDto[]) {
  //   const newHistories = bodies.map((body) => {
  //     return this.historyRepository.create({
  //       order: body.order,
  //       outDate: body.outDate,
  //       quantity: body.quantity,
  //       remark: body.remark,
  //       item: { id: body.item },
  //     });
  //   });

  //   const savedHistories = await this.historyRepository.save(newHistories);

  //   return savedHistories;
  // }

  async getHistory() {
    const getHistory = await this.historyRepository.find({
      relations: {
        item: true,
        lot: true,
      },
    });

    return getHistory;
  }

  async getHistorys(id: number) {
    const getHistorys1 = await this.historyRepository.findOne({
      where: { id },
      relations: {
        item: true,
        lot: true,
      },
    });
    return getHistorys1;
  }

  async remove(id: number) {
    const findByid = await this.getHistorys(id);
    await this.historyRepository.remove(findByid);
    return findByid;
  }

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
    const saveHistory = await this.historyRepository.save(newhistory);

    const sumQuantity = await this.summaryQuantity(itemToUpdate.id);

    itemToUpdate.quantity = sumQuantity.sum;
    await this.itemRepository.save(itemToUpdate);

    return saveHistory;
  }
}
