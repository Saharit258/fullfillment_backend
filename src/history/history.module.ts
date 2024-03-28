import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { history } from 'src/entities/history.entity';
import { item } from '../entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([history, item])],
  providers: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
