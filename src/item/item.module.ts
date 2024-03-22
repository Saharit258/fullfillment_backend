import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { item } from 'src/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([item])],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
