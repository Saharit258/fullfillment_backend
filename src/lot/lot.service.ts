import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lot } from '../entities/lot.entity';
import { history } from 'src/entities/history.entity';
import { CreateLotDto } from './dto/create-lot.dto';

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(lot)
    private lotRepository: Repository<lot>,
    @InjectRepository(history)
    private historyRepository: Repository<history>,
  ) {}

  async addLot(body: CreateLotDto) {
    const newItem = this.lotRepository.create({
      name: body.name,
      incomingDate: body.incomingDate,
      quantity: body.quantity,
    });

    return this.lotRepository.save(newItem);
  }

  async summaryQuantity(id: number) {
    const sum = await this.historyRepository
      .createQueryBuilder('history')
      .select('SUM(history.quantity)::int4', 'sum')
      .where('history.itemId = :id', { id })
      .getRawOne();
    return sum;
  }
}
