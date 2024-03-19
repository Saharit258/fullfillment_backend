import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { history } from '../endtiter/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(history)
    private historyRepository: Repository<history>,
  ) {}

  addHistory(body: any) {
    const newhistory = this.historyRepository.create({
      order: body.order,
      note: body.note,
      outDate: body.outDate,
      quantity: body.quantity,
      item: body.item,
      lot: body.lot,
    });

    return this.historyRepository.save(newhistory);
  }

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
    });
    return getHistorys1;
  }

  editHistory() {}
}
