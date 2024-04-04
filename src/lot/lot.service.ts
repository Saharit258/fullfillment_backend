import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lot } from '../entities/lot.entity';
import { History } from 'src/entities/history.entity';
import { Item } from '../entities/item.entity';
import { CreateLotDto } from './dto/create-lot.dto';
import { CreateItemDto } from '../item/dto/create-item.dto';
import { CreateHistoryDto } from '../history/dto/create-history.dio';

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(lot)
    private lotRepository: Repository<lot>,
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async addLot(body: CreateLotDto) {
    const newItem = this.lotRepository.create({
      name: body.name,
      incomingDate: body.incomingDate,
      quantity: body.quantity,
    });

    return this.lotRepository.save(newItem);
  }

  // async summaryQuantity(id: number) {
  //   const sum = await this.historyRepository
  //     .createQueryBuilder('history')
  //     .select('SUM(history.quantity)::int4', 'sum')
  //     .where('history.itemId = :id', { id })
  //     .getRawOne();
  //   return sum;
  // }

  // async getItems(id: number) {
  //   const getItems1 = await this.itemRepository.findOne({
  //     where: { id },
  //   });
  //   return getItems1;
  // }

  // async addHistorys(body: CreateHistoryDto, itemId: number) {
  //   const itemToUpdate = await this.getItems(body.item);
  //   if (!itemToUpdate) {
  //     throw new NotFoundException(`Item with ID ${itemId} not found`);
  //   }
  //   const newhistory = this.historyRepository.create({
  //     order: body.order,
  //     note: body.note,
  //     outDate: body.outDate,
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
}
