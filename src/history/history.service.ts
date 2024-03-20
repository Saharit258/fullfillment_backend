import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { history } from '../endtiter/history.entity';
import { CreateHistoryDto } from './dto/create-history.dio';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(history)
    private historyRepository: Repository<history>,
  ) {}

  addHistory(body: CreateHistoryDto) {
    const newhistory = this.historyRepository.create({
      order: body.order,
      note: body.note,
      outDate: body.outDate,
      quantity: body.quantity,
      remark: body.remark,
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

  async updateHistory(id: number, body: CreateHistoryDto) {
    let findByid = await this.getHistorys(id);
    findByid = { ...findByid, ...body };
    const saveHistory = await this.historyRepository.save(findByid);
    return saveHistory;
  }
}
