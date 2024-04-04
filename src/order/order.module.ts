import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrdernoService } from '../orderno/orderno.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderNo } from '../entities/orderno.entity';
import { Item } from '../entities/item.entity';
import { History } from '../entities/history.entity';
import { HistoryOrder } from 'src/entities/historyorder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderNo, Item, History, HistoryOrder]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrdernoService],
})
export class OrderModule {}
