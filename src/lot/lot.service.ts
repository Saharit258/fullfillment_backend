import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lot } from '../endtiter/lot.entity';
import { CreateLotDto } from './dto/create-lot.dto';

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(lot)
    private lotRepository: Repository<lot>,
  ) {}

  addLot(body: CreateLotDto) {
    const newLot = new lot();
    newLot.name = body.name;
    newLot.incomingDate = body.incomingDate;
    newLot.quantity = body.quantity;

    return this.lotRepository.save(newLot);
  }

  getLot() {
    const getlot = this.lotRepository.find();
    return getlot;
  }
}
