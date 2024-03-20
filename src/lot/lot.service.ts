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
    const newLot = this.lotRepository.create({
      name: body.name,
      incomingDate: body.incomingDate,
      quantity: body.quantity,
    });

    return this.lotRepository.save(newLot);
  }

  async getLot() {
    const getlot = await this.lotRepository.find();
    return getlot;
  }

  async getLots(id: number) {
    const getloto = await this.lotRepository.findOne({
      where: { id },
    });
    return getloto;
  }
}
