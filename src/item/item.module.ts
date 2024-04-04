import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { HistoryService } from '../history/history.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { History } from 'src/entities/history.entity';
import { Stores } from 'src/entities/stores.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, History, Stores])],
  providers: [ItemService, HistoryService],
  controllers: [ItemController],
})
export class ItemModule {}
