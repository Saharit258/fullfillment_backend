import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { Stores } from '../entities/stores.entity';
import { Item } from '../entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Stores, Item])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
