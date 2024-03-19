import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lot } from '../endtiter/lot.entity';

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(lot)
    private lotRepository: Repository<lot>,
  ) {}

  addLot(body: any) {
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
