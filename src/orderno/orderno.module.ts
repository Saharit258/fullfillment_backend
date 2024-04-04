import { Module } from '@nestjs/common';
import { OrdernoService } from './orderno.service';
import { OrdernoController } from './orderno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderNo } from '../entities/orderno.entity';
import { Order } from '../entities/order.entity';
import { Item } from '../entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderNo, Order, Item])],
  controllers: [OrdernoController],
  providers: [OrdernoService],
})
export class OrdernoModule {}
