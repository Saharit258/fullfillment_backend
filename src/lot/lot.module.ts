import { Module } from '@nestjs/common';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lot } from 'src/entities/lot.entity';
import { History } from 'src/entities/history.entity';
import { Item } from '../entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([lot, History, Item])],
  providers: [LotService],
  controllers: [LotController],
})
export class LotModule {}
