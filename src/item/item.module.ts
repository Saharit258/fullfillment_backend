import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { item } from 'src/entities/item.entity';
import { history } from 'src/entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([item, history])],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
