import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from 'src/entities/history.entity';
import { Item } from '../entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History, Item])],
  providers: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
