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
    const newhistory = new history();
    newhistory.order = body.order;
    newhistory.note = body.note;
    newhistory.outDate = body.outDate;
    newhistory.quantity = body.quantity;

    return this.historyRepository.save(newhistory);
  }

  getHistory() {
    const getHistory = this.historyRepository.find();
    return getHistory;
  }
}
